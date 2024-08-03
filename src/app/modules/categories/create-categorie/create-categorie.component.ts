import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { PREVISUALIZA_IMAGEN } from 'src/app/config/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-categorie',
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss']
})
export class CreateCategorieComponent {

  type_categorie: number = 1;

  name!: string;
  icon!: string;
  position: number = 1;
  categorie_second_id: '';
  categorie_third_id: '';

  imagen_previsualiza: any = PREVISUALIZA_IMAGEN;
  file_imagen: any = null;

  isLoading$: any;

  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];

  constructor(
    public categorieService: CategoriesService,
    public toastr: ToastrService,
    public router: Router,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();
  }

  config() {
    this.categorieService.configCategories().subscribe((resp: any) => {
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    })
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
    this.categorieService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.categorieService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeCategorie(val: number) {
    this.type_categorie = val;
    this.categorie_third_id = '';
    this.categorie_second_id = '';
  }

  changeDepartament() {
    this.categorie_second_id = '';
    this.categories_seconds_backups = this.categories_seconds.filter((item: any) => item.categorie_second_id == this.categorie_third_id)
  }

  save() {
    if (!this.name || !this.position) {
      this.toastr.error('validacion', 'Todos los campos son requeridos');
      return;
    }

    if (this.type_categorie == 1 && !this.icon) {
      this.toastr.error('validacion', 'El icono es requerido');
      return;
    }

    if (this.type_categorie == 1 && !this.file_imagen) {
      this.toastr.error('validacion', 'La imagen es requerida');
      return;
    }

    if (this.type_categorie == 2 && !this.categorie_second_id) {
      this.toastr.error('validacion', 'El departamento es requerido');
      return;
    }

    if (this.type_categorie == 3 && (!this.categorie_second_id || !this.categorie_third_id)) {
      this.toastr.error('validacion', 'El departamento y la categoria es requerido');
      return;
    }

    let formData = new FormData();
    formData.append('name', this.name);
    if (this.icon) {
      formData.append('icon', this.icon);
    }
    formData.append('position', this.position + "");
    formData.append('type_categorie', this.type_categorie + "");

    if (this.file_imagen) {
      formData.append('image', this.file_imagen);
    }

    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }

    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }

    this.categorieService.createCategories(formData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error('validacion', 'La Categoria ya existe');
        return;
      }

      this.name = '';
      this.icon = '';
      this.position = 1;
      this.type_categorie = 1;
      this.imagen_previsualiza = PREVISUALIZA_IMAGEN;
      // Restablecer el campo de entrada de archivo
      const imageInput = <HTMLInputElement>document.getElementById('customFile');
      if (imageInput) {
        imageInput.value = '';
      }
      // Restablecer this.file_imagen
      this.file_imagen = null;
      this.categorie_second_id = '';
      this.categorie_third_id = '';
      this.toastr.success('Exito', 'Categoria creada correctamente');
      this.router.navigateByUrl(`/categories/list/edit/${resp.id}`);
      this.config();
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }
}
