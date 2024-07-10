import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../service/brand.service';
import { CreateBrandComponent } from '../create-brand/create-brand.component';
import { EditBrandComponent } from '../edit-brand/edit-brand.component';
import { DeleteBrandComponent } from '../delete-brand/delete-brand.component';

@Component({
  selector: 'app-lists-brands',
  templateUrl: './lists-brands.component.html',
  styleUrls: ['./lists-brands.component.scss']
})
export class ListsBrandsComponent {

  brands: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public brandService: BrandService,
    public modalService: NgbModal,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.listBrands();
    this.isLoading$ = this.brandService.isLoading$;
  }

  listBrands(page = 1) {
    this.brandService.listBrands(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.brands = resp.brands;
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  loadPage($event: any) {
    console.log($event);
    this.listBrands($event);
  }

  searchTo() {
    this.listBrands();
  }

  //Tamaños de modal
  // 'sm': para un modal pequeño
  // 'lg': para un modal grande
  // 'xl': para un modal extra grande
  // 'full': para un modal de pantalla completa

  openModalCreateBrand() {
    const modalRef = this.modalService.open(CreateBrandComponent, { centered: true, size: 'md' });

    modalRef.componentInstance.BrandC.subscribe((brand: any) => {
      this.brands.unshift(brand);
    });
  }

  openModalEditBrand(brand: any) {
    const modalRef = this.modalService.open(EditBrandComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.brand = brand;

    modalRef.componentInstance.BrandE.subscribe((brand: any) => {
      // this.brands.unshift(brand);
      let INDEX = this.brands.findIndex((item: any) => item.id == brand.id);

      if (INDEX != -1) {
        this.brands[INDEX] = brand;
      }
    });
  }

  deleteBrand(brand: any) {
    const modalRef = this.modalService.open(DeleteBrandComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.brand = brand;

    modalRef.componentInstance.BrandD.subscribe((resp: any) => {
      let INDEX = this.brands.findIndex((item: any) => item.id == brand.id);
      if (INDEX != -1) {
        this.brands.splice(INDEX, 1)
      }
    });
  }
}
