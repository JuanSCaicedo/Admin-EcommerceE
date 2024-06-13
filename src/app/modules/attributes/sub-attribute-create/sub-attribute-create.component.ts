import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubAttributeDeleteComponent } from '../sub-attribute-delete/sub-attribute-delete.component';

@Component({
  selector: 'app-sub-attribute-create',
  templateUrl: './sub-attribute-create.component.html',
  styleUrls: ['./sub-attribute-create.component.scss']
})
export class SubAttributeCreateComponent {

  // @Output() AttributeC: EventEmitter<any> = new EventEmitter<any>();
  @Input() attribute: any;
  @Input() properties: any = [];

  name!: string;
  isLoading$: any;

  type_action: number = 0;
  color: any;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.properties = this.attribute.properties;
  }

  store() {
    if (!this.name || this.type_action == 0 || !this.type_action) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    if (this.type_action == 2 && !this.color) {
      this.toastr.error('Validación', 'Seleccionar un color');
      return;
    }

    let data = {
      name: this.name,
      code: this.color,
      attribute_id: this.attribute.id,
    };

    this.attributeService.createProperties(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error', 'Ya existe un atributo con el mismo nombre');
        return;
      } else {
        this.properties.unshift(resp.propertie);
        this.toastr.success('Éxito', 'Atributo creado correctamente');

        // Restablecer los valores
        this.name = '';
        this.color = '';
        this.type_action = 0;
      }
    })
  }

  delete(propertie: any) {

    const modalRef = this.modalService.open(SubAttributeDeleteComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.propertie = propertie;

    modalRef.componentInstance.PropertieD.subscribe((resp: any) => {
      let INDEX = this.properties.findIndex((item: any) => item.id == propertie.id);
      if (INDEX != -1) {
        this.properties.splice(INDEX, 1)
      }
    });
  }
}
