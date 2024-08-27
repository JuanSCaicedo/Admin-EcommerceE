import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CuponesService } from '../service/cupones.service';


@Component({
  selector: 'app-create-cupone',
  templateUrl: './create-cupone.component.html',
  styleUrls: ['./create-cupone.component.scss']
})
export class CreateCuponeComponent {

  brands:any = [];
  brand_id: any = '';
  brands_add:any = [];
  code: any;
  categories_first:any = [];
  categorie_id:any = '';
  categories_add:any = [];
  discount: number = 0;
  num_use: number = 0;
  type_discount: number = 1;
  type_count: number = 1;
  type_cupone: number = 1;
  products:any = [];
  product_id:any = '';
  products_add:any = [];

  isLoading$: any;

  constructor(
    public cuponesService: CuponesService,
    public toastr: ToastrService,
    public router: Router,
  ) {

  }

  ngOnInit(): void {
    // this.isLoading$ = this.cuponesService.isLoading$;
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }

  changeTypeCount(value: number) {
    this.type_count = value;
  }

  changeTypeCupone(value: number) {
    this.type_cupone = value;
  }

  removeProduct(product:any) {

  }

  removeCategorie(categorie: any) {

  }

  removeBrand(brand: any) {

  }

  save() {

  }
}
