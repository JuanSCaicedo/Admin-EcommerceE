import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributesService } from '../../service/attributes.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-anidado-variations',
  templateUrl: './edit-anidado-variations.component.html',
  styleUrls: ['./edit-anidado-variations.component.scss']
})
export class EditAnidadoVariationsComponent {

  @Output() SpecificationE: EventEmitter<any> = new EventEmitter<any>();

  @Input() specification: any;
  @Input() attributes_variations: any = [];
  @Input() is_variation: any; //cuando se false va ser una edición para las especificaciones y si es true una edición para las variaciones

  isLoading$: any;
  state!: string;
  checked!: boolean;

  attributes: any = [];
  specification_attribute_id: string = '';
  type_attribute_specification: number = 3;
  type_attribute_variation: number = 3;
  variations_attribute_id: string = '';
  @Input() attributes_specifications: any = [];

  description: any = '';
  dropdownList: any = [];
  dropdownListVariations: any = [];
  dropdownSettings: IDropdownSettings = {};

  properties: any = [];
  propertie_id: any = '';
  specifications: any = [];
  selectedItems: any = []; //campo_4
  stock_add: number = 0;
  precio_add: number = 0;
  value_add: any = null;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {

    this.isLoading$ = this.attributeService.isLoading$;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.state = this.specification.state;
    if (this.state == '1') {
      this.checked = true;
    } else if (this.state == '2') {
      this.checked = false;
    }

    setTimeout(() => {

      if (!this.is_variation) {
        this.specification_attribute_id = this.specification.attribute_id;
        this.changeSpecifications();
      } else {
        this.variations_attribute_id = this.specification.attribute_id;
        this.changeVariations();
      }

      setTimeout(() => {
        this.propertie_id = this.specification.propertie_id ? this.specification.propertie_id : null;

        if (this.specification.attribute.type_attribute == 4) {
          this.value_add = this.specification.value_add ? JSON.parse(this.specification.value_add) : [];
          this.selectedItems = this.value_add;
        } else {
          this.value_add = this.specification.value_add ? this.specification.value_add : null;
        }
      }, 25);
    }, 50);

    if (this.is_variation) {
      this.precio_add = this.specification.add_price;
      this.stock_add = this.specification.stock;
    }
  }

  changeSpecifications() {

    this.propertie_id = '';
    this.value_add = null;
    this.selectedItems = [];

    let ATTRIBUTE = this.attributes_specifications.find((item: any) => item.id == this.specification_attribute_id);

    if (ATTRIBUTE) {
      this.type_attribute_specification = ATTRIBUTE.type_attribute;

      if (this.type_attribute_specification == 3 || this.type_attribute_specification == 4) {
        this.properties = ATTRIBUTE.properties;
        this.dropdownList = ATTRIBUTE.properties;
      } else {
        this.properties = [];
        this.dropdownList = [];
      }

    } else {
      this.type_attribute_specification = 0;
      this.properties = [];
      this.dropdownList = [];
    }
  }

  changeVariations() {

    this.propertie_id = '';
    this.value_add = null;

    let ATTRIBUTE = this.attributes_variations.find((item: any) => item.id == this.variations_attribute_id);

    if (ATTRIBUTE) {
      this.type_attribute_specification = ATTRIBUTE.type_attribute;

      if (this.type_attribute_specification == 3 || this.type_attribute_specification == 4) {
        this.properties = ATTRIBUTE.properties;
      } else {
        this.properties = [];
      }

    } else {
      this.type_attribute_specification = 0;
      this.properties = [];
    }
  }

  store() {
    if (!this.is_variation) {
      this.storeSpecification();
    } else {
      this.storeVariation();
    }
  }

  storeSpecification() {

    if (!this.state) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    if (this.type_attribute_specification == 4 && this.selectedItems.length == 0) {
      this.toastr.error('Validación', 'Seleccione un valor');
      return;
    }

    if (this.selectedItems.length > 0) {
      this.value_add = JSON.stringify(this.selectedItems);
    }

    if (!this.specification_attribute_id || (!this.propertie_id && !this.value_add)) {
      this.toastr.error('Validación', 'Seleccione un atributo y un valor');
      return;
    }

    let data = {
      product_id: this.specification.product_id,
      attribute_id: this.specification_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      state: this.state,
    };

    this.attributeService.updateSpecification(this.specification.id, data).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.toastr.success("Exito", "Se actualizó la especificación correctamente");
        this.SpecificationE.emit(resp);
        this.modal.close();
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    })
  }

  storeVariation() {

    if (!this.state || this.precio_add < 0 || !this.stock_add) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    if (!this.variations_attribute_id || (!this.propertie_id && !this.value_add)) {
      this.toastr.error('Validación', 'Seleccione un atributo y un valor');
      return;
    }

    let data = {
      product_id: this.specification.product_id,
      attribute_id: this.variations_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      state: this.state,
      add_price: this.precio_add,
      stock: this.stock_add,
      product_variation_id: this.specification.product_variation_id,
    };

    this.attributeService.updateVariationsAnidadas(this.specification.id, data).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.toastr.success("Exito", "Se actualizó la variación anidada correctamente");
        this.SpecificationE.emit(resp);
        this.modal.close();
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    })
  }

  onSwitchChange(event: any) {
    this.state = event.target.checked ? '1' : '2';
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
