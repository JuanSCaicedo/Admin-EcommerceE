import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sub-attribute-create',
  templateUrl: './sub-attribute-create.component.html',
  styleUrls: ['./sub-attribute-create.component.scss']
})
export class SubAttributeCreateComponent {

  // @Output() AttributeC: EventEmitter<any> = new EventEmitter<any>();
  @Input() properties: any = [];

  name!: string;
  isLoading$: any;

  type_action:number = 1;
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
  }

  store() {
    if (!this.name) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      code: this.color,
      // state: 2,
    };

    this.attributeService.createAttributes(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error', 'Ya existe un atributo con el mismo nombre');
        return;
      } else {
        // this.AttributeC.emit(resp.attribute);
        this.toastr.success('Éxito', 'Atributo creado correctamente');
        this.modal.close();
      }
    })
  }

  delete(propertie: any) {

  }
}
