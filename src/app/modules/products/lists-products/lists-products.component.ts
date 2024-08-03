import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { ProductService } from '../service/product.service';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lists-products',
  templateUrl: './lists-products.component.html',
  styleUrls: ['./lists-products.component.scss']
})
export class ListsProductsComponent {
  products: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  marcas: any = [];
  marca_id: string = '';
  categorie_first_id: string = '';
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];
  categories_thirds: any = [];
  categories_thirds_backups: any = [];

  constructor(
    public productService: ProductService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.listProducts();
    this.isLoading$ = this.productService.isLoading$;
    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;
    });
  }

  changeDepartament() {
    this.categories_thirds_backups = [];
    this.categories_seconds_backups = [];

    this.categorie_second_id = '';
    this.categorie_third_id = '';

    setTimeout(() => {
      this.categories_seconds_backups = this.categories_seconds.filter((item: any) =>
        item.categorie_second_id == this.categorie_first_id
      )
    }, 50);
  }

  changeCategorie() {
    this.categorie_third_id = '';
    this.categories_thirds_backups = [];

    setTimeout(() => {
      this.categories_thirds_backups = this.categories_thirds.filter((item: any) =>
        item.categorie_second_id == this.categorie_second_id
      )
    }, 50);
  }

  clearFields() {
    if (!this.search
      && !this.marca_id
      && !this.categorie_first_id
      && !this.categorie_second_id
      && !this.categorie_third_id) {
      this.toastr.error('Validación', 'No hay valores para limpiar');
      return;
    }

    this.search = '';
    this.marca_id = '';
    this.categorie_first_id = '';
    this.categorie_second_id = '';
    this.categorie_third_id = '';

    setTimeout(() => {
      this.listProducts();
    }, 50);
  }

  listProducts(page = 1) {

    let data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
    }

    this.productService.listProducts(page, data).subscribe((resp: any) => {
      console.log(resp);
      this.products = resp.products.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }

  searchTo() {
    if (!this.search && !this.marca_id && !this.categorie_first_id && !this.categorie_second_id && !this.categorie_third_id) {
      this.toastr.error('Validación', 'Ingrese al menos un valor para buscar');
      return;
    }
    this.listProducts();
  }


  loadPage($event: any) {
    console.log($event);
    this.listProducts($event);
  }

  deleteProduct(product: any) {
    const modalRef = this.modalService.open(DeleteProductComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.product = product;

    modalRef.componentInstance.ProductD.subscribe((resp: any) => {
      let INDEX = this.products.findIndex((item: any) => item.id == product.id);
      if (INDEX != -1) {
        this.products.splice(INDEX, 1)
      }
    });
  }
}
