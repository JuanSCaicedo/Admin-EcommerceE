import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributesService } from '../../service/attributes.service';

@Component({
  selector: 'app-delete-variation-specifications',
  templateUrl: './delete-variation-specifications.component.html',
  styleUrls: ['./delete-variation-specifications.component.scss']
})
export class DeleteVariationSpecificationsComponent {

  @Input() specification: any;
  @Input() is_variation: any;

  @Output() SpecificationD: EventEmitter<any> = new EventEmitter();
  isLoading$: any;

  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
  }

  delete(){
    if (this.is_variation) {
      this.deleteVariation();
    } else {
      this.deleteSpecification();
    }
  }

  deleteSpecification() {
    this.attributeService.deleteSpecification(this.specification.id).subscribe((resp: any) => {
      this.SpecificationD.emit({ message: 200 });
      this.modal.close();
      this.toastr.success('Exito', 'Producto eliminado correctamente');
    })
  }

  deleteVariation() {
    this.attributeService.deleteVariations(this.specification.id).subscribe((resp: any) => {
      this.SpecificationD.emit({ message: 200 });
      this.modal.close();
      this.toastr.success('Exito', 'Producto eliminado correctamente');
    })
  }
}
