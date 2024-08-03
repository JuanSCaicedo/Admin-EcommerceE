import { Component, EventEmitter, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-attribute',
  templateUrl: './create-attribute.component.html',
  styleUrls: ['./create-attribute.component.scss']
})
export class CreateAttributeComponent {

  @Output() AttributeC: EventEmitter<any> = new EventEmitter<any>();

  name!: string;
  type_attribute: number = 0;
  isLoading$: any;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
  }

  store() {
    if (!this.name || !this.type_attribute || this.type_attribute === 0) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      type_attribute: this.type_attribute,
      state: 2,
    };

    this.attributeService.createAttributes(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error', 'Ya existe un atributo con el mismo nombre');
        return;
      } else {
        this.AttributeC.emit(resp.attribute);
        this.toastr.success('Éxito', 'Atributo creado correctamente');
        this.modal.close();
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message);
    })
  }
}
