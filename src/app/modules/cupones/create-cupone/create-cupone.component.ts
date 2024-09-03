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

  brands: any = [];
  brand_id: any = '';
  brands_add: any = [];
  code: any;
  categories_first: any = [];
  categorie_id: any = '';
  categories_add: any = [];
  discount: number = 0;
  num_use: number = 0;
  type_discount: number = 1;
  type_count: number = 1;
  type_cupone: number = 1;
  products: any = [];
  product_id: any = '';
  products_add: any = [];

  isLoading$: any;

  constructor(
    public cuponesService: CuponesService,
    public toastr: ToastrService,
    public router: Router,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.cuponesService.isLoading$;

    this.cuponesService.configCupones().subscribe((response: any) => {
      this.categories_first = response.categories;
      this.products = response.products;
      this.brands = response.brands;
    });
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }

  changeTypeCount(value: number) {
    this.type_count = value;
  }

  changeTypeCupone(value: number) {
    this.type_cupone = value;
    this.product_id = '';
    this.categorie_id = '';
    this.brand_id = '';
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
  }

  removeProduct(product: any) {
    let INDEX = this.products_add.findIndex((prod: any) => prod.id == product.id);

    if (INDEX != -1) {
      this.products_add.splice(INDEX, 1);
      this.toastr.success("Éxito", "Producto eliminado correctamente");
    }
  }

  removeCategorie(categorie: any) {
    let INDEX = this.categories_add.findIndex((prod: any) => prod.id == categorie.id);

    if (INDEX != -1) {
      this.categories_add.splice(INDEX, 1);
      this.toastr.success("Éxito", "Categoria eliminada correctamente");
    }
  }

  removeBrand(brand: any) {
    let INDEX = this.brands_add.findIndex((prod: any) => prod.id == brand.id);

    if (INDEX != -1) {
      this.brands_add.splice(INDEX, 1);
      this.toastr.success("Éxito", "Marca eliminada correctamente");
    }
  }

  save() {
    if(!this.code || !this.discount) {
      this.toastr.error("Validación", "Complete todos los campos");
      return;
    }

    if (this.discount <= 0) {
      this.toastr.error("Validación", "El descuento debe ser mayor a 0");
      return;
    }

    if (this.type_count == 2 && this.num_use <= 0) {
      this.toastr.error("Validación", "El número de usos debe ser mayor a 0");
      return;
    }

    if (this.type_cupone == 1 && this.products_add.length == 0) {
      this.toastr.error("Validación", "Debe agregar al menos un producto");
      return;
    }

    if (this.type_cupone == 2 && this.categories_add.length == 0) {
      this.toastr.error("Validación", "Debe agregar al menos una categoria");
      return;
    }

    if (this.type_cupone == 3 && this.brands_add.length == 0) {
      this.toastr.error("Validación", "Debe agregar al menos una marca");
      return;
    }

    let data = {
      type_discount: this.type_discount,
      type_count: this.type_count,
      type_cupone: this.type_cupone,
      num_use: this.num_use,
      discount: this.discount,
      code: this.code,
      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
    }

    this.cuponesService.createCupones(data).subscribe((resp: any) => {
      console.log(resp);

      if(resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      }else {
        this.toastr.success("Éxito", "Cupón creado correctamente");
        this.type_discount = 1;
        this.type_count = 1;
        this.type_cupone = 1;
        this.num_use = 0;
        this.discount = 0;
        this.code = null;
        this.product_id = '';
        this.categorie_id = '';
        this.brand_id = '';
        this.products_add = [];
        this.categories_add = [];
        this.brands_add = [];
      }
    });
  }

  AddProduct() {
    if (!this.product_id) {
      this.toastr.error("Validación", "Seleccione un producto");
      return;
    }

    let INDEX = this.products_add.findIndex((prod: any) => prod.id == this.product_id);

    if (INDEX != -1) {
      this.toastr.error("Validación", "El producto ya se encuentra agregado");
      return;
    }

    let DATA = this.products.find((product: any) => product.id == this.product_id);

    if (DATA) {
      this.products_add.push(DATA);
      this.product_id = '';
      this.toastr.success("Éxito", "Producto agregado correctamente");
    }
  }

  AddCategorie() {
    if (!this.categorie_id) {
      this.toastr.error("Validación", "Seleccione una categoria");
      return;
    }

    let INDEX = this.categories_add.findIndex((prod: any) => prod.id == this.categorie_id);

    if (INDEX != -1) {
      this.toastr.error("Validación", "La categoria ya se encuentra agregada");
      return;
    }

    let DATA = this.categories_first.find((categorie: any) => categorie.id == this.categorie_id);

    if (DATA) {
      this.categories_add.push(DATA);
      this.categorie_id = '';
      this.toastr.success("Éxito", "Categoria agregadacorrectamente");
    }
  }

  AddBrand() {
    if (!this.brand_id) {
      this.toastr.error("Validación", "Seleccione una marca");
      return;
    }

    let INDEX = this.brands_add.findIndex((prod: any) => prod.id == this.brand_id);

    if (INDEX != -1) {
      this.toastr.error("Validación", "La marca ya se encuentra agregada");
      return;
    }

    let DATA = this.brands.find((brand: any) => brand.id == this.brand_id);

    if (DATA) {
      this.brands_add.push(DATA);
      this.brand_id = '';
      this.toastr.success("Éxito", "Marca agregada correctamente");
    }
  }
}
