import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../service/home.service';

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.scss']
})
export class EditHomeComponent {

  isLoading$: any;
  homeViews: any = [];
  search: string = '';

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
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }

  searchTo() {
    this.listHomeViews();
  }

  openModalEditHome(homeView:any) {

  }
}
