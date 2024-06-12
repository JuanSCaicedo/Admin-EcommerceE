import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent {

  @Output() AttributeE: EventEmitter<any> = new EventEmitter<any>();

  @Input() attribute: any; 

  name!: string;
  type_attribute: number = 0;
  isLoading$: any;
  state!: string;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.name = this.attribute.name;
    this.type_attribute = this.attribute.type_attribute;
    this.state = this.attribute.state;
  }

  store() {
    if (!this.name || !this.type_attribute || this.type_attribute === 0 || !this.state) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      type_attribute: this.type_attribute,
      state: this.state,
    };

    this.attributeService.updateAttributes(this.attribute.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error', 'Ya existe un atributo con el mismo nombre');
        return;
      } else {
        this.AttributeE.emit(resp.attribute);
        this.toastr.success('Éxito', 'Atributo creado correctamente');
        this.modal.close();
      }
    })
  }
}
