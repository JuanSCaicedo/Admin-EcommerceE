import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PREVISUALIZA_IMAGEN } from 'src/app/config/config';
import { SlidersService } from '../service/sliders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-sliders',
  templateUrl: './create-sliders.component.html',
  styleUrls: ['./create-sliders.component.scss']
})
export class CreateSlidersComponent {

  title!: string;
  label!: string;
  subtitle!: string;
  link!: string;
  color!: string;

  imagen_previsualiza: any = PREVISUALIZA_IMAGEN;
  file_imagen: any = null;

  isLoading$: any;

  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService,
    public router: Router,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.sliderService.isLoading$;
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  save() {
    if (!this.title || !this.subtitle || !this.file_imagen) {
      this.toastr.error('validacion', 'Todos los campos son requeridos');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);

    if (this.label) {
      formData.append('label', this.label);
    }

    formData.append('subtitle', this.subtitle);
    formData.append('image', this.file_imagen);

    if (this.link) {
      formData.append('link', this.link);
    }

    if (this.color) {
      formData.append('color', this.color);
    }

    this.sliderService.createSliders(formData).subscribe((resp: any) => {
      console.log(resp);

      this.title = '';
      this.label = '';
      this.subtitle = '';
      this.link = '';
      this.color = '';
      this.imagen_previsualiza = PREVISUALIZA_IMAGEN;
      // Restablecer el campo de entrada de archivo
      const imageInput = <HTMLInputElement>document.getElementById('customFile');
      if (imageInput) {
        imageInput.value = '';
      }
      // Restablecer this.file_imagen
      this.file_imagen = null;
      this.toastr.success('Exito', 'Slider creado correctamente');

      this.router.navigateByUrl(`/sliders/list/edit/${resp.id}`);
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }
}
