import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CuponesService } from '../service/cupones.service';
import { DeleteCuponeComponent } from '../delete-cupone/delete-cupone.component';

@Component({
  selector: 'app-list-cupone',
  templateUrl: './list-cupone.component.html',
  styleUrls: ['./list-cupone.component.scss']
})
export class ListCuponeComponent {

  cupones: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public cuponeService: CuponesService,
    public modalService: NgbModal,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.listCupones();
    this.isLoading$ = this.cuponeService.isLoading$;
  }

  listCupones(page = 1) {
    this.cuponeService.listCupones(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.cupones = resp.cupones.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }

  searchTo() {
    this.listCupones();
  }

  loadPage($event: any) {
    console.log($event);
    this.listCupones($event);
  }

  getNameTypeCupone(type_cupone: number) {
    let NAME = '';

    switch (type_cupone) {
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

  deleteCupone(cupone: any) {
    const modalRef = this.modalService.open(DeleteCuponeComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.categorie = cupone;

    modalRef.componentInstance.CategorieD.subscribe((resp: any) => {
      let INDEX = this.cupones.findIndex((item: any) => item.id == cupone.id);
      if (INDEX != -1) {
        this.cupones.splice(INDEX, 1)
      }
    });
  }
}
