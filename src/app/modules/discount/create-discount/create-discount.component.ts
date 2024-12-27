import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DiscountService } from '../service/discount.service';

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss']
})
export class CreateDiscountComponent {
  brands: any = [];
  brand_id: any = '';
  brands_add: any = [];
  categories_first: any = [];
  categorie_id: any = '';
  categories_add: any = [];
  discount: number = 0;
  type_discount: number = 1;
  discount_type: number = 1;
  type_campaing: number = 1;
  products: any = [];
  product_id: any = '';
  products_add: any = [];

  start_date: any;
  end_date: any;

  isLoading$: any;

  constructor(
    public discountService: DiscountService,
    public toastr: ToastrService,
    public router: Router,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.discountService.isLoading$;

    this.discountService.configDiscounts().subscribe((response: any) => {
      this.categories_first = response.categories;
      this.products = response.products;
      this.brands = response.brands;
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }

  changeTypeCampaing(value: number) {
    this.type_campaing = value;
  }

  changeTypeCupone(value: number) {
    this.discount_type = value;
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
    if (!this.discount || !this.start_date || !this.end_date) {
      this.toastr.error("Validación", "Complete todos los campos");
      return;
    }

    if(this.start_date > this.end_date){
      this.toastr.error("Validación", "La fecha de inicio no puede ser mayor a la fecha de fin");
      return;
    }

    const date = new Date();
    const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (this.start_date < today) {
      this.toastr.error("Validación", "La fecha de inicio no puede ser menor a la fecha actual");
      return;
    }
    
    if (this.discount <= 0) {
      this.toastr.error("Validación", "El descuento debe ser mayor a 0");
      return;
    }

    if (this.discount_type == 1 && this.products_add.length == 0) {
      this.toastr.error("Validación", "Debe agregar al menos un producto");
      return;
    }

    if (this.discount_type == 2 && this.categories_add.length == 0) {
      this.toastr.error("Validación", "Debe agregar al menos una categoria");
      return;
    }

    if (this.discount_type == 3 && this.brands_add.length == 0) {
      this.toastr.error("Validación", "Debe agregar al menos una marca");
      return;
    }

    let data = {
      type_discount: this.type_discount,
      discount_type: this.discount_type,
      discount: this.discount,
      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
      start_date: this.start_date,
      end_date: this.end_date,
      type_campaing: this.type_campaing
    }

    this.discountService.createDiscounts(data).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error("Validación", resp.message_text);
      } else {
        this.toastr.success("Éxito", "Campaña de descuento creada correctamente");
        // this.type_discount = 1;
        // this.discount_type = 1;
        // this.discount = 0;
        // this.product_id = '';
        // this.categorie_id = '';
        // this.brand_id = '';
        // this.products_add = [];
        // this.categories_add = [];
        // this.brands_add = [];
        // this.start_date = '';
        this.end_date = '';

        this.router.navigateByUrl(`/discount/list/edit/${resp.id}`);
      }
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
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
