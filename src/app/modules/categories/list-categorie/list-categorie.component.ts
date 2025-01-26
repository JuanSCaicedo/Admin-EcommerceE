import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCategorieComponent } from '../delete-categorie/delete-categorie.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.scss']
})
export class ListCategorieComponent {

  categories: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public categorieService: CategoriesService,
    public modalService: NgbModal,
    public toastr: ToastrService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.listCategories();
    this.auth.validarToken();
    this.isLoading$ = this.categorieService.isLoading$;
  }
  listCategories(page = 1) {
    this.categorieService.listCategories(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.categories = resp.categories.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }

  searchTo() {
    this.listCategories();
  }

  loadPage($event: any) {
    console.log($event);
    this.listCategories($event);
  }

  getDomParser(categorie: any) {
    var miDiv: any = document.getElementById('svg-categorie-' + categorie.id);
    miDiv.innerHTML = categorie.icon;
    return '';
  }

  deleteCategorie(categorie: any) {
    const modalRef = this.modalService.open(DeleteCategorieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.categorie = categorie;

    modalRef.componentInstance.CategorieD.subscribe((resp: any) => {
      let INDEX = this.categories.findIndex((item: any) => item.id == categorie.id);
      if (INDEX != -1) {
        this.categories.splice(INDEX, 1)
      }
    });
  }
}
