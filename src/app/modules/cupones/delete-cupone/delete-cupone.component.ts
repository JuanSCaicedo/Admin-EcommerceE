import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CuponesService } from '../service/cupones.service';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-delete-cupone',
  templateUrl: './delete-cupone.component.html',
  styleUrls: ['./delete-cupone.component.scss']
})
export class DeleteCuponeComponent {
  @Input() cupone: any;

  @Output() CuponD: EventEmitter<any> = new EventEmitter();
  isLoading$: any;

  constructor(
    public cuponeService: CuponesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.cuponeService.isLoading$;
  }

  delete() {
    this.cuponeService.deleteCupone(this.cupone.id).subscribe((resp: any) => {
      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.CuponD.emit({ message: 200 });
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
