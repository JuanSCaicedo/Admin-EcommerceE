import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-categorie',
  templateUrl: './delete-categorie.component.html',
  styleUrls: ['./delete-categorie.component.scss']
})
export class DeleteCategorieComponent {
  @Input() categorie: any;

  @Output() CategorieD: EventEmitter<any> = new EventEmitter();
  isLoading$: any;

  constructor(
    public categorieService: CategoriesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.categorieService.isLoading$;
  }

  delete() {
    this.categorieService.deleteCategorie(this.categorie.id).subscribe((resp: any) => {
      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.CategorieD.emit({ message: 200 });
        this.modal.close();
        this.toastr.success('Exito', 'Categoria eliminada correctamente');
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    })
  }
}
