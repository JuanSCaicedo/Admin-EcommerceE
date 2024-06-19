import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PREVISUALIZA_IMAGEN } from 'src/app/config/config';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {

  title!: string;
  sku!: string;
  resumen!: string;

  price_cop!:number;
  price_usd!: number;

  categorie_first_id!: string;
  categorie_second_id!: string;
  categorie_third_id!: string;

  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];
  categories_thirds: any = [];
  categories_thirds_backups: any = [];
  
  description:any = '<p>Hello, world!</p>';

  imagen_previsualiza: any = PREVISUALIZA_IMAGEN;
  file_imagen: any = null;

  isLoading$: any;

  constructor(
    public productService: ProductService,
    public toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;
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
    this.categories_seconds_backups = this.categories_seconds.filter((item: any) => item.categorie_second_id == this.categorie_second_id);
  }

  changeCategorie() {
  
  }

  save() {
    if (!this.title || !this.file_imagen) {
      this.toastr.error('validacion', 'Todos los campos son requeridos');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);

    formData.append('image', this.file_imagen);

    this.productService.createProducts(formData).subscribe((resp: any) => {
      console.log(resp);

      this.title = '';
      this.imagen_previsualiza = PREVISUALIZA_IMAGEN;
      // Restablecer el campo de entrada de archivo
      const imageInput = <HTMLInputElement>document.getElementById('customFile');
      if (imageInput) {
        imageInput.value = '';
      }
      // Restablecer this.file_imagen
      this.file_imagen = null;
      this.toastr.success('Exito', 'Producto creado correctamente');
    });
  }
}
