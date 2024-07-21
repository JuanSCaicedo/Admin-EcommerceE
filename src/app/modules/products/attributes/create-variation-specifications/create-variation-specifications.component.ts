import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PREVISUALIZA_IMAGEN } from 'src/app/config/config';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributesService } from '../../service/attributes.service';

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

  especification_attribute_id: string = '';
  type_attribute_specification: number = 3;
  type_attribute_variation: number = 3;

  PRODUCT_ID: string = '';
  PRODUCT_SELECTED: any = [];
  precio_add: number = 0;
  properties: any = [];
  propertie_id: any = '';
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
  }

  configAll() {
    this.attributeService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.attributes_specifications = resp.attributes_specifications;
    });
  }

  changeSpecifications() {

    this.propertie_id = '';
    this.value_add = null;
    this.selectedItems = [];

    let ATTRIBUTE = this.attributes_specifications.find((item: any) => item.id == this.especification_attribute_id);

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

    if (!this.especification_attribute_id || (!this.propertie_id && !this.value_add)) {
      this.toastr.error('Validación', 'Seleccione un atributo y un valor');
      return;
    }

    let data = {
      product_id: this.PRODUCT_ID,
      attribute_id: this.especification_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
    };

    this.attributeService.createSpecification(data).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.toastr.success("Exito", "Se registro la especificación correctamente");
        this.value_add = null;
        this.propertie_id = '';
        this.especification_attribute_id = '';
        this.properties = [];
        this.type_attribute_specification = 3;
      }
    });
  }
}
