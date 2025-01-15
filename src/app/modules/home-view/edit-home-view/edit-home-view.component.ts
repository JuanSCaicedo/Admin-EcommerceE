import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../service/home.service';

@Component({
  selector: 'app-edit-home-view',
  templateUrl: './edit-home-view.component.html',
  styleUrls: ['./edit-home-view.component.scss']
})
export class EditHomeViewComponent {

  @Output() homeViewE: EventEmitter<any> = new EventEmitter<any>();

  @Input() homeView: any;

  name!: string;
  isLoading$: any;
  state!: string;
  updated_at!: string;
  checked!: boolean;

  constructor(
    public homeService: HomeService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.homeService.isLoading$;
    this.name = this.homeView.name;
    this.state = this.homeView.state;
    this.updated_at = this.homeView.updated_at;

    if (this.state == '1') {
      this.checked = true;
    } else if (this.state == '2') {
      this.checked = false;
    }
  }

  store() {
    if (!this.name || !this.state) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      state: this.state,
    };

    this.homeService.updateHomeViews(this.homeView.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error', 'Ya existe una marca con el mismo nombre');
        return;
      } else {
        this.homeViewE.emit(resp.homeView);
        this.toastr.success('Éxito', 'Vista actualizada correctamente');
        this.modal.close();
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    })
  }

  onSwitchChange(event: any) {
    this.state = event.target.checked ? '1' : '2';
  }
}
