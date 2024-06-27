import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PREVISUALIZA_IMAGEN } from 'src/app/config/config';
import { ProductService } from '../service/product.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {

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
  file_imagen: any = null;

  isLoading$: any;
  word: string = '';
  selectedItems: any = [];

  PRODUCT_ID: string = '';
  PRODUCT_SELECTED: any = [];

  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.isLoading$ = this.productService.isLoading$;

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

    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;

      this.showProduct();
    });
  }

  showProduct() {
    this.productService.showProduct(this.PRODUCT_ID).subscribe((resp: any) => {
      console.log(resp);

      this.PRODUCT_SELECTED = resp.product;
      this.title = resp.product.title;
      this.sku = resp.product.sku;
      this.resumen = resp.product.resumen;
      this.price_cop = resp.product.price_cop;
      this.price_usd = resp.product.price_usd;
      this.description = resp.product.description;
      this.marca_id = resp.product.brand_id;
      this.categorie_first_id = resp.product.categorie_first_id;
      this.categorie_second_id = resp.product.categorie_second_id || '';
      this.categorie_third_id = resp.product.categorie_third_id || '';
      this.imagen_previsualiza = resp.product.imagen;
      this.selectedItems = resp.product.selectedItems;
      this.dropdownList = resp.product.tags;
      this.selectedItems = resp.product.tags;

      this.categories_seconds_backups = this.categories_seconds.filter((item: any) =>
        item.categorie_second_id == this.categorie_first_id);
      this.categories_thirds_backups = this.categories_thirds.filter((item: any) =>
        item.categorie_second_id == this.categorie_second_id);
    });
  }

  addItems() {
    this.isShowMultiselect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    this.selectedItems.push({ item_id: time_date, item_text: this.word });

    setTimeout(() => {
      this.word = '';
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100);
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toastr.error("Validacion", "El archivo no es una imagen");
      return;
    }

    this.file_imagen = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
    this.isLoadingView();
  }

  isLoadingView() {
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  changeDepartament() {
    this.categories_thirds_backups = [];
    this.categories_seconds_backups = [];

    this.categorie_second_id = '';
    this.categorie_third_id = '';

    setTimeout(() => {
      this.categories_seconds_backups = this.categories_seconds.filter((item: any) =>
        item.categorie_second_id == this.categorie_first_id
      )
    }, 50);
  }

  changeCategorie() {
    this.categorie_third_id = '';
    this.categories_thirds_backups = [];

    setTimeout(() => {
      this.categories_thirds_backups = this.categories_thirds.filter((item: any) =>
        item.categorie_second_id == this.categorie_second_id
      )
    }, 50);
  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  save() {
    if (!this.title
      || !this.sku || !this.price_cop || !this.price_usd
      || !this.marca_id || !this.categorie_first_id
      || !this.description || !this.resumen
      || this.selectedItems.length == 0
    ) {
      this.toastr.error('validacion', 'Todos los campos son requeridos');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    formData.append('sku', this.sku);
    formData.append('price_cop', this.price_cop + "");
    formData.append('price_usd', this.price_usd + "");
    formData.append('brand_id', this.marca_id);

    if (this.file_imagen) {
      formData.append('portada', this.file_imagen);
    }

    formData.append('categorie_first_id', this.categorie_first_id);

    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    } else {
      formData.append('categorie_second_id', '');
    }

    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    } else {
      formData.append('categorie_third_id', '');
    }

    formData.append('description', this.description);
    formData.append('resumen', this.resumen);

    formData.append('multiselect', JSON.stringify(this.selectedItems));

    this.productService.updateProducts(this.PRODUCT_ID, formData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error('Validación', resp.message_text);
      } else {
        this.toastr.success('Exito', 'Producto editado correctamente');
      }
    });
  }
}
