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
  resumen!: string;

  price_cop!: number;
  price_usd!: number;

  marca_id: string = '';
  marcas: any = [];

  categorie_first_id: string = '';
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];
  categories_thirds: any = [];
  categories_thirds_backups: any = [];

  description: any = '';
  dropdownList: any = [];
  dropdownSettings: IDropdownSettings = {};

  isShowMultiselect: Boolean = false;

  imagen_previsualiza: any = PREVISUALIZA_IMAGEN;
  imagen_add_previsualiza: any = PREVISUALIZA_IMAGEN;
  file_imagen: any = null;

  isLoading$: any;
  imagen_add: any;
  images_files: any = [];
  word: string = '';
  selectedItems: any = [];

  PRODUCT_ID: string = '';
  PRODUCT_SELECTED: any = [];

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
      idField: 'item_id',
      textField: 'item_text',
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

  isLoadingView() {
    this.attributeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributeService.isLoadingSubject.next(false);
    }, 50);
  }


  save() {

  }
}
