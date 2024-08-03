import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from '../service/brand.service';
@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.scss']
})
export class DeleteBrandComponent {

  @Input() brand: any;

  @Output() BrandD: EventEmitter<any> = new EventEmitter();
  isLoading$: any;

  constructor(
    public brandService: BrandService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.brandService.isLoading$;
  }

  delete() {
    this.brandService.deleteBrand(this.brand.id).subscribe((resp: any) => {
      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.BrandD.emit({ message: 200 });
        this.modal.close();
        this.toastr.success('Exito', 'Marca eliminada correctamente');
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message);
    })
  }
}
