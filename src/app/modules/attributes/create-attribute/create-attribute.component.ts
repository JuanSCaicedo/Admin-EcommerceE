import { Component } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-attribute',
  templateUrl: './create-attribute.component.html',
  styleUrls: ['./create-attribute.component.scss']
})
export class CreateAttributeComponent {
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
  }
}
