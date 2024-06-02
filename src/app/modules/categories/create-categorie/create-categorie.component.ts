import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';

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
  categorie_second_id!: string;
  categorie_third_id!: string;

  imagen_previsualiza: any = "https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg";
  file_imagen: any = null;
  
  constructor(
    public categorieService: CategoriesService,
    public toastr: ToastrService
  ) {

  }

  processFile($event: any) {
    if ($event.target.files[0].tipe.indexOf('image') < 0) {
      this.toastr.error('validacion','El archivo seleccionado no es una imagen');
      return;      
    }
    this.file_imagen = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
  }

  changeTypeCategorie(val: number) {
    this.type_categorie = val;
  }
  save() {
    
  }
}
