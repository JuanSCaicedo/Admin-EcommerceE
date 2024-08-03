import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributesService } from '../service/attributes.service';

@Component({
  selector: 'app-delete-attribute',
  templateUrl: './delete-attribute.component.html',
  styleUrls: ['./delete-attribute.component.scss']
})
export class DeleteAttributeComponent {
  
  @Input() attribute: any;

  @Output() AttributeD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.attributeService.isLoading$;
  }

  delete() {
    this.attributeService.deleteAttribute(this.attribute.id).subscribe((resp: any) => {
      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.AttributeD.emit({ message: 200 });
        this.modal.close();
        this.toastr.success('Exito', 'Categoria eliminada correctamente');
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    })
  }
}
