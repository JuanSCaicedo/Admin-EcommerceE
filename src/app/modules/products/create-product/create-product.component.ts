import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PREVISUALIZA_IMAGEN } from 'src/app/config/config';
import { ProductService } from '../service/product.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
// import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
// import {
//   ClassicEditor,
//   Bold,
//   Essentials,
//   Italic,
//   Paragraph,
//   Undo,
//   Table, TableToolbar,
//   Image, ImageInsert, AutoImage,
//   Alignment,
//   SpecialCharacters, SpecialCharactersEssentials,
//   SelectAll,
//   MediaEmbed,
//   Link, AutoLink,
//   Heading,
//   Font,
//   Indent, IndentBlock,
//   List,
//   BlockQuote,
// } from 'ckeditor5';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {

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

  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    public router: Router,
    private authService: AuthService,
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
    this.configAll();
  }

  config: any = {
    versionCheck: false,
  };

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;
    }, (error: any) => {
      if (error.status == 401) {
        this.authService.sessionExpired();
      } else {
        console.log(error);
        this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
      }
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

  // public onChange(event: any) {
  //   this.description = event.editor.getData();
  // }

  // public Editor = ClassicEditor;
  // public config = {
  //   toolbar: ['undo', 'redo', '|',
  //     'heading', '|',
  //     'bold',
  //     'italic', '|',
  //     'link',
  //     'insertTable',
  //     'insertImage',
  //     'blockQuote',
  //     'mediaEmbed', '|',
  //     'alignment',
  //     'specialCharacters',
  //     'selectAll', '|',
  //     'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
  //     'outdent', 'indent',
  //     'bulletedList', 'numberedList',
  //   ],
  //   plugins: [
  //     Undo,
  //     Bold, Essentials,
  //     Italic, Paragraph,
  //     Heading,
  //     Table, TableToolbar,
  //     Image, ImageInsert, AutoImage,
  //     Alignment,
  //     SpecialCharacters, SpecialCharactersEssentials,
  //     SelectAll,
  //     MediaEmbed,
  //     Link, AutoLink,
  //     Font,
  //     Indent, IndentBlock,
  //     List,
  //     BlockQuote,
  //   ],
  //   table: {
  //     contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  //   }
  // }

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
    if (!this.title || !this.file_imagen
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
    formData.append('portada', this.file_imagen);

    formData.append('categorie_first_id', this.categorie_first_id);
    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }
    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }

    formData.append('description', this.description);
    formData.append('resumen', this.resumen);

    formData.append('multiselect', JSON.stringify(this.selectedItems));

    this.productService.createProducts(formData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error('Validación', resp.message_text);
      } else {
        this.title = '';
        this.imagen_previsualiza = PREVISUALIZA_IMAGEN;

        // Restablecer el campo de entrada de archivo
        const imageInput = <HTMLInputElement>document.getElementById('customFile');
        if (imageInput) {
          imageInput.value = '';
        }
        // Restablecer this.file_imagen
        this.file_imagen = null;
        this.sku = '';
        this.price_cop = 0;
        this.price_usd = 0;
        this.marca_id = '';
        this.categorie_first_id = '';
        this.categorie_second_id = '';
        this.categorie_third_id = '';
        this.description = '';
        this.resumen = '';
        this.selectedItems = [];
        this.dropdownList = [];

        this.toastr.success('Exito', 'Producto creado correctamente');

        this.router.navigateByUrl(`/products/list/edit/${resp.id}`);
      }
    }, (error: any) => {
      if (error.status == 401) {
        this.authService.sessionExpired();
      } else {
        console.log(error);
        this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
      }
    });
  }
}
