import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PREVISUALIZA_IMAGEN } from 'src/app/config/config';
import { URL_BACKEND } from 'src/app/config/config';
import { SlidersService } from '../service/sliders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-sliders',
  templateUrl: './edit-sliders.component.html',
  styleUrls: ['./edit-sliders.component.scss']
})
export class EditSlidersComponent {

  state!: number;
  checked!: boolean;

  title!: string;
  label!: string;
  subtitle!: string;
  link!: string;
  color!: string;

  imagen_previsualiza: any = PREVISUALIZA_IMAGEN;
  imagen_previsualiza_bk: any = PREVISUALIZA_IMAGEN;
  file_imagen: any = null;

  imageDeleted: boolean;

  isLoading$: any;

  slider_id!: string;

  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService,
    public activedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.sliderService.isLoading$;

    this.activedRoute.params.subscribe((resp: any) => {
      this.slider_id = resp.id;
    });

    this.sliderService.showSlider(this.slider_id).subscribe((resp: any) => {
      console.log(resp);

      this.title = resp.slider.title;
      this.label = resp.slider.label;
      this.subtitle = resp.slider.subtitle;
      this.link = resp.slider.link;
      this.color = resp.slider.color;

      if (resp.slider.imagen === URL_BACKEND + "/storage/") {
        this.imagen_previsualiza = this.imagen_previsualiza_bk;
      } else {
        this.imagen_previsualiza = resp.slider.imagen;
      }

      this.state = resp.slider.state;

      if (this.state == 1) {
        this.checked = true;
      } else if (this.state == 2) {
        this.checked = false;
      }

    });
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

  deleteImage() {
    if (confirm('¿Estás seguro de que deseas eliminar la imagen?')) {
      this.imagen_previsualiza = this.imagen_previsualiza_bk;
      this.imageDeleted = true;
    } else {
      this.imageDeleted = false;
    }
  }

  onSwitchChange(event: any) {
    this.state = event.target.checked ? 1 : 2;
  }

  save() {
    if (!this.title || !this.subtitle) {
      this.toastr.error('validacion', 'Todos los campos son requeridos');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);

    if (this.label) {
      formData.append('label', this.label);
    }

    formData.append('subtitle', this.subtitle);

    if (this.imageDeleted) {
      formData.append('image', '');
    }

    if (this.file_imagen) {
      formData.append('image', this.file_imagen);
    }

    formData.append('state', this.state + "");

    if (this.link) {
      formData.append('link', this.link);
    }

    if (this.color) {
      formData.append('color', this.color);
    }

    this.sliderService.updateSliders(this.slider_id, formData).subscribe((resp: any) => {
      console.log(resp);
      this.toastr.success('Exito', 'Slider actualizado correctamente');
    });
  }
}
