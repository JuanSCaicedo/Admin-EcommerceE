import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent {

  @Output() BrandC: EventEmitter<any> = new EventEmitter<any>();

  name!: string;
  isLoading$: any;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.brandService.isLoading$;
  }

  store() {
    if (!this.name) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      state: 2,
    };

    this.brandService.createBrands(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error', 'Ya existe una marca con el mismo nombre');
        return;
      } else {
        this.BrandC.emit(resp.brand);
        this.toastr.success('Éxito', 'Marca creada correctamente');
        this.modal.close();
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message);
    })
  }
}
