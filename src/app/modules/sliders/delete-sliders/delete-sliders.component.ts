import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SlidersService } from '../service/sliders.service';

@Component({
  selector: 'app-delete-sliders',
  templateUrl: './delete-sliders.component.html',
  styleUrls: ['./delete-sliders.component.scss']
})
export class DeleteSlidersComponent {
  @Input() slider: any;

  @Output() SliderD: EventEmitter<any> = new EventEmitter();
  isLoading$: any;

  constructor(
    public sliderService: SlidersService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.sliderService.isLoading$;
  }

  delete(){
    this.sliderService.deleteSlider(this.slider.id).subscribe((resp:any) => {
      if(resp.message == 403){
        this.toastr.error("Validación",resp.message_text);
      }else{
        this.SliderD.emit({message: 200});
        this.modal.close();
        this.toastr.success('Exito', 'Slider eliminada correctamente');
      }
    })
  }
}
