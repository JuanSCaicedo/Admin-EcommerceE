import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';

@Component({
  selector: 'app-create-anidado-variations',
  templateUrl: './create-anidado-variations.component.html',
  styleUrls: ['./create-anidado-variations.component.scss']
})
export class CreateAnidadoVariationsComponent {

  @Input() variation: any;

  specification_attribute_id: string = '';
  type_attribute_specification: number = 2;
  variations_attribute_id: string = '';
  type_attribute_variation: number = 3;
  attributes: any = [];

  precio_add: number = 0;
  stock_add: number = 0;

  attributes_specifications: any = [];
  @Input() attributes_variations: any = [];
  properties: any = [];
  propertie_id: any = '';
  value_add: any = null;
  specifications: any = [];
  variations: any = [];

  isLoading$: any;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    console.log(this.variation);
  }

  changeVariations() {

    this.propertie_id = '';
    this.value_add = null;

    let ATTRIBUTE = this.attributes_variations.find((item: any) => item.id == this.variations_attribute_id);

    if (ATTRIBUTE) {
      this.type_attribute_variation = ATTRIBUTE.type_attribute;

      if (this.type_attribute_variation == 3 || this.type_attribute_variation == 4) {
        this.properties = ATTRIBUTE.properties;
      } else {
        this.properties = [];
      }

    } else {
      this.type_attribute_variation = 0;
      this.properties = [];
    }
  }

  saveVariation() {
  }

  store() {
  }

  getValueAttribute(attribute_special: any) {
    if (attribute_special.propertie_id) {
      return attribute_special.propertie.name;
    }

    if (attribute_special.value_add) {
      // Verifica si el valor parece un JSON válido
      if (typeof attribute_special.value_add === 'string' && attribute_special.value_add.startsWith('[') && attribute_special.value_add.endsWith(']')) {
        try {
          let values = JSON.parse(attribute_special.value_add);
          if (Array.isArray(values)) {
            return values.map(v => v.name).join(', ');
          }
        } catch (e) {
          console.error("Invalid JSON:", attribute_special.value_add);
        }
      }
      return attribute_special.value_add;
    }

    return "---";
  }

  editVariation(variation: any) {

  }
  deleteVariation(variation: any) {

  }
}
