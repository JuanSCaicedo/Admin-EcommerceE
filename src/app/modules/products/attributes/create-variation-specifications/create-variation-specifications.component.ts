import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributesService } from '../../service/attributes.service';
import { EditVariationSpecificationsComponent } from '../edit-variation-specifications/edit-variation-specifications.component';
import { DeleteVariationSpecificationsComponent } from '../delete-variation-specifications/delete-variation-specifications.component';

@Component({
  selector: 'app-create-variation-specifications',
  templateUrl: './create-variation-specifications.component.html',
  styleUrls: ['./create-variation-specifications.component.scss']
})
export class CreateVariationSpecificationsComponent {

  title!: string;
  sku!: string;

  attributes: any = [];
  attributes_specifications: any = [];
  attributes_variations: any = [];

  value_add_variation: any = '';

  description: any = '';
  dropdownList: any = [];
  dropdownListVariations: any = [];
  dropdownSettings: IDropdownSettings = {};

  isShowMultiselect: Boolean = false;

  isLoading$: any;
  word: string = '';
  selectedItems: any = []; //campo_4
  selectedItemsVariations: any = []; //campo_4
  stock_add: number = 0;

  specification_attribute_id: string = '';
  type_attribute_specification: number = 3;
  type_attribute_variation: number = 3;

  PRODUCT_ID: string = '';
  PRODUCT_SELECTED: any = [];
  precio_add: number = 0;
  properties: any = [];
  propertie_id: any = '';
  propertie_id_v: any = '';
  specifications: any = [];
  variations: any = [];
  variations_attribute_id: string = '';

  value_add: any = null;

  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
  ) { }

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

    this.activatedRoute.params.subscribe((resp: any) => {
      console.log(resp);
      this.PRODUCT_ID = resp.id;
    });

    this.showProduct();
    this.configAll();
    this.listSpecification();
    this.listVariations();
  }

  configAll() {
    this.attributeService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.attributes_specifications = resp.attributes_specifications;
      this.attributes_variations = resp.attributes_variations;
    });
  }

  listSpecification() {
    this.attributeService.listSpecification(this.PRODUCT_ID).subscribe((resp: any) => {
      console.log(resp);
      this.specifications = resp.specifications;
    });
  }

  listVariations() {
    this.attributeService.listVariations(this.PRODUCT_ID).subscribe((resp: any) => {
      console.log(resp);
      this.variations = resp.variations;
    });
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

    this.propertie_id_v = '';
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

  showProduct() {
    this.attributeService.showProduct(this.PRODUCT_ID).subscribe((resp: any) => {
      console.log(resp);

      this.PRODUCT_SELECTED = resp.product;
      this.title = resp.product.title;
      this.sku = resp.product.sku;
    });
  }

  addItems() {

    if (!this.word || this.word.trim() === '') {
      this.toastr.error('Validación', 'El campo de entrada tag no puede estar vacío');
      return;
    }

    this.isShowMultiselect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    // this.selectedItems.push({ item_id: time_date, item_text: this.word });

    setTimeout(() => {
      this.word = '';
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100);
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  isLoadingView() {
    this.attributeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributeService.isLoadingSubject.next(false);
    }, 50);
  }

  save() {

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
      product_id: this.PRODUCT_ID,
      attribute_id: this.specification_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      state: 2,
    };

    this.attributeService.createSpecification(data).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.toastr.success("Exito", "Se registro la especificación correctamente");
        this.specifications.unshift(resp.specification);
        this.value_add = null;
        this.propertie_id = '';
        this.specification_attribute_id = '';
        this.properties = [];
        this.type_attribute_specification = 3;
      }
    });
  }

  saveVariation() {

    if (!this.variations_attribute_id || (!this.propertie_id_v && !this.value_add)) {
      this.toastr.error('Validación', 'Seleccione un atributo y un valor');
      return;
    }

    if (this.precio_add < 0) {
      this.toastr.error('Validación', 'El precio debe ser mayor o igual a 0');
      return;
    }

    if (this.stock_add <= 0) {
      this.toastr.error('Validación', 'El stock debe ser mayor a 0');
      return;
    }

    let data = {
      product_id: this.PRODUCT_ID,
      attribute_id: this.variations_attribute_id,
      propertie_id: this.propertie_id_v,
      value_add: this.value_add,
      state: 2,
      add_price: this.precio_add,
      stock: this.stock_add,
    };

    this.attributeService.createVariations(data).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.toastr.success("Exito", "Se registro la variación correctamente");
        this.variations.unshift(resp.variation);
        this.value_add = null;
        this.propertie_id_v = '';
        this.variations_attribute_id = '';
        this.properties = [];
        this.type_attribute_specification = 3;
        this.precio_add = 0;
        this.stock_add = 0;
      }
    });
  }

  editVariation(variaton: any) {
    const modal = this.modalService.open(EditVariationSpecificationsComponent, { centered: true, size: 'md' });
    modal.componentInstance.specification = variaton;
    modal.componentInstance.attributes_specifications = this.attributes_specifications;
    modal.componentInstance.attributes_variations = this.attributes_variations;
    modal.componentInstance.is_variation = 1;

    modal.componentInstance.SpecificationE.subscribe((edit: any) => {
      let INDEX = this.variations.findIndex((item: any) => item.id == edit.variation.id);

      if (INDEX != -1) {
        this.variations[INDEX] = edit.variation;
      }
    })
  }

  editSpecification(specification: any) {
    const modal = this.modalService.open(EditVariationSpecificationsComponent, { centered: true, size: 'md' });
    modal.componentInstance.specification = specification;
    modal.componentInstance.attributes_specifications = this.attributes_specifications;

    modal.componentInstance.SpecificationE.subscribe((edit: any) => {
      let INDEX = this.specifications.findIndex((item: any) => item.id == edit.specification.id);

      if (INDEX != -1) {
        this.specifications[INDEX] = edit.specification;
      }
    })
  }

  deleteSpecification(specification: any) {
    const modal = this.modalService.open(DeleteVariationSpecificationsComponent, { centered: true, size: 'md' });
    modal.componentInstance.specification = specification;
    modal.componentInstance.attributes_specifications = this.attributes_specifications;

    modal.componentInstance.SpecificationD.subscribe((edit: any) => {
      let INDEX = this.specifications.findIndex((item: any) => item.id == specification.id);

      if (INDEX != -1) {
        this.specifications.splice(INDEX, 1);
      }
    })
  }

  deleteVariation(variation: any) {
    const modal = this.modalService.open(DeleteVariationSpecificationsComponent, { centered: true, size: 'md' });
    modal.componentInstance.specification = variation;
    modal.componentInstance.attributes_specifications = this.attributes_specifications;
    modal.componentInstance.is_variation = 1;

    modal.componentInstance.SpecificationD.subscribe((edit: any) => {
      let INDEX = this.variations.findIndex((item: any) => item.id == variation.id);

      if (INDEX != -1) {
        this.variations.splice(INDEX, 1);
      }
    })
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
}
