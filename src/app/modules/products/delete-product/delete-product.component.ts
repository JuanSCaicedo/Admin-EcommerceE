import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../service/product.service';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent {

  @Input() product: any;

  @Output() ProductD: EventEmitter<any> = new EventEmitter();
  isLoading$: any;

  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;
  }

  delete() {
    this.productService.deleteProduct(this.product.id).subscribe((resp: any) => {
      this.ProductD.emit({ message: 200 });
      this.modal.close();
      this.toastr.success('Exito', 'Producto eliminado correctamente');
    }, (error: any) => {
      if (error.status == 401) {
        this.authService.sessionExpired();
      } else {
        console.log(error);
        this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
      }
    })
  }
}
