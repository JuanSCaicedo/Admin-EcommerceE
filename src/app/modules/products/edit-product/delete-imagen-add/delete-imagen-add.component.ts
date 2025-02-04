import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../service/product.service';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-delete-imagen-add',
  templateUrl: './delete-imagen-add.component.html',
  styleUrls: ['./delete-imagen-add.component.scss']
})
export class DeleteImagenAddComponent {

  @Input() id: any;

  @Output() ImagenD: EventEmitter<any> = new EventEmitter();
  isLoading$: any;

  constructor(
    public productImagenService: ProductService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.productImagenService.isLoading$;
  }

  delete() {
    this.productImagenService.deleteImagenProduct(this.id).subscribe((resp: any) => {
      this.ImagenD.emit({ message: 200 });
      this.modal.close();
      this.toastr.success('Exito', 'Imagen eliminada correctamente');
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
