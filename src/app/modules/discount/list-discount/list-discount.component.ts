import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DiscountService } from '../service/discount.service';
import { DeleteDiscountComponent } from '../delete-discount/delete-discount.component';
import { URL_TIENDA } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-list-discount',
  templateUrl: './list-discount.component.html',
  styleUrls: ['./list-discount.component.scss']
})
export class ListDiscountComponent {

  discounts: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public discountService: DiscountService,
    public modalService: NgbModal,
    public toastr: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.listDiscounts();
    this.isLoading$ = this.discountService.isLoading$;
  }

  listDiscounts(page = 1) {
    this.discountService.listDiscounts(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.discounts = resp.discounts.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    }, (error: any) => {
      if (error.status == 401) {
        this.authService.sessionExpired();
      } else {
        console.log(error);
        this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
      }
    });
  }

  searchTo() {
    this.listDiscounts();
  }

  loadPage($event: any) {
    console.log($event);
    this.listDiscounts($event);
  }

  getNameTypeDiscount(discount_type: number) {
    let NAME = '';

    switch (discount_type) {
      case 1:
        NAME = 'Productos';
        break;
      case 2:
        NAME = 'Categorias';
        break;
      case 3:
        NAME = 'Marcas';
    }

    return NAME;
  }

  getNameTypeCampaing(type_campaign: number) {
    let NAME = '';

    switch (type_campaign) {
      case 1:
        NAME = 'Campaña normal';
        break;
      case 2:
        NAME = 'Campaña flash';
        break;
      case 3:
        NAME = 'Campaña link';
    }

    return NAME;
  }

  copyLink(discount: any) {
    var aux = document.createElement("input");
    aux.setAttribute("value", URL_TIENDA + "/discount/" + discount.code);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toastr.info('Link copiado al portapapeles');
  }

  deleteDiscount(discount: any) {
    const modalRef = this.modalService.open(DeleteDiscountComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.discount = discount;

    modalRef.componentInstance.DiscountD.subscribe((resp: any) => {
      let INDEX = this.discounts.findIndex((item: any) => item.id == discount.id);
      if (INDEX != -1) {
        this.discounts.splice(INDEX, 1)
      }
    });
  }
}
