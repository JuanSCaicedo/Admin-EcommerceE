import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../service/home.service';
import { EditHomeViewComponent } from '../edit-home-view/edit-home-view.component';

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.scss']
})
export class EditHomeComponent {

  isLoading$: any;
  homeViews: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public homeService: HomeService,
    public modalService: NgbModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.listHomeViews();
    this.isLoading$ = this.homeService.isLoading$;
  }

  listHomeViews(page = 1) {
    this.homeService.listHomeViews(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.homeViews = resp.home_views;
      this.totalPages = resp.total;
      this.currentPage = page;
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }

  searchTo() {
    this.listHomeViews();
  }

  loadPage($event: any) {
    console.log($event);
    this.listHomeViews();
  }

  openModalEditHome(homeView: any) {
    const modalRef = this.modalService.open(EditHomeViewComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.homeView = homeView;

    modalRef.componentInstance.homeViewE.subscribe((homeView: any) => {
      // this.brands.unshift(brand);
      let INDEX = this.homeViews.findIndex((item: any) => item.id == homeView.id);

      if (INDEX != -1) {
        this.homeViews[INDEX] = homeView;
      }
    });
  }
}
