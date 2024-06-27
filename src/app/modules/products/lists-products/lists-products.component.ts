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

  constructor(
    public productService: ProductService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.listProducts();
    this.isLoading$ = this.productService.isLoading$;
  }

  listProducts(page = 1) {
    this.productService.listProducts(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.products = resp.products.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message);
    });
  }

  searchTo() {
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
