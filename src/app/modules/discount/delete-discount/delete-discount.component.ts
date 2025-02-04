import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscountService } from '../service/discount.service';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-delete-discount',
  templateUrl: './delete-discount.component.html',
  styleUrls: ['./delete-discount.component.scss']
})
export class DeleteDiscountComponent {
  @Input() discount: any;

  @Output() DiscountD: EventEmitter<any> = new EventEmitter();
  isLoading$: any;

  constructor(
    public discountService: DiscountService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.discountService.isLoading$;
  }

  delete() {
    this.discountService.deleteDiscount(this.discount.id).subscribe((resp: any) => {
      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.DiscountD.emit({ message: 200 });
        this.modal.close();
        this.toastr.success('Exito', 'Cupón eliminado correctamente');
      }
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
