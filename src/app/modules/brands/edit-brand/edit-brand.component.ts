import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent {

  @Output() BrandE: EventEmitter<any> = new EventEmitter<any>();

  @Input() brand: any;

  name!: string;
  isLoading$: any;
  state!: string;
  checked!: boolean;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.brandService.isLoading$;
    this.name = this.brand.name;
    this.state = this.brand.state;

    if (this.state == '1') {
      this.checked = true;
    } else if (this.state == '2') {
      this.checked = false;
    }
  }

  store() {
    if (!this.name || !this.state) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      state: this.state,
    };

    this.brandService.updateBrands(this.brand.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error', 'Ya existe una marca con el mismo nombre');
        return;
      } else {
        this.BrandE.emit(resp.brand);
        this.toastr.success('Éxito', 'Marca actualizada correctamente');
        this.modal.close();
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message);
    })
  }

  onSwitchChange(event: any) {
    this.state = event.target.checked ? '1' : '2';
  }
}
