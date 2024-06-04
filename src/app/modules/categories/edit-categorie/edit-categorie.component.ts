import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.scss']
})
export class EditCategorieComponent {
  type_categorie: number = 1;

  name!: string;
  icon!: string;
  position: number = 1;
  categorie_second_id!: string;
  categorie_third_id!: string;
  state: string = '1';

  imagen_previsualiza: any = "https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg";
  file_imagen: any = null;

  isLoading$: any;

  categories_first: any = [];
  categories_seconds: any = [];

  CATEGORIE_ID: string = '';
  CATEGORIE: any = null;

  constructor(
    public categorieService: CategoriesService,
    private toastr: ToastrService,
    public ActivatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();

    this.ActivatedRoute.params.subscribe((resp: any) => {
      console.log(resp);
      this.CATEGORIE_ID = resp.id;
    })

    this.categorieService.showCategorie(this.CATEGORIE_ID).subscribe((resp: any) => {
      console.log(resp);

      this.CATEGORIE = resp.categorie;
      this.type_categorie = resp.categorie.type_categorie;
      this.name = resp.categorie.name;
      this.icon = resp.categorie.icon;
      this.position = resp.categorie.position;
      this.categorie_second_id = resp.categorie.categorie_second_id;
      this.categorie_third_id = resp.categorie.categorie_third_id;
      this.state = resp.categorie.state; // assign the state here
      if (resp.categorie.imagen) {
        this.imagen_previsualiza = resp.categorie.imagen;
      }
    })
  }

  config() {
    this.categorieService.configCategories().subscribe((resp: any) => {
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
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
  save() {
    if (!this.name || !this.position) {
      this.toastr.error('validacion', 'Todos los campos son requeridos');
      return;
    }

    if (this.type_categorie == 1 && !this.icon) {
      this.toastr.error('validacion', 'El icono es requerido');
      return;
    }

    // if (this.type_categorie == 1 && !this.file_imagen) {
    //   this.toastr.error('validacion', 'La imagen es requerida');
    //   return;
    // }

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
    } else {
      if (this.CATEGORIE.icon) {
        formData.append('icon', '');
      }
    }
    formData.append('position', this.position + "");
    formData.append('type_categorie', this.type_categorie + "");

    if (this.file_imagen) {
      formData.append('image', this.file_imagen);
    }

    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    } else {
      if (this.CATEGORIE.categorie_second_id) {
        formData.append('categorie_second_id', '');
      }
    }

    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    } else {
      if (this.CATEGORIE.categorie_third_id) {
        formData.append('categorie_third_id', '');
      }
    }

    if (this.state) {
      formData.append('state', this.state);
    }

    this.categorieService.updateCategories(this.CATEGORIE_ID, formData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error('validacion', 'La Categoria ya existe');
        return;
      }

      this.toastr.success('Exito', 'Categoria actualizada correctamente');
      this.config();
    });
  }
}
