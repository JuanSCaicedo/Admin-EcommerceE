import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { ListsProductsComponent } from './lists-products/lists-products.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
// import { CKEditorModule } from 'ckeditor4-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DeleteImagenAddComponent } from './edit-product/delete-imagen-add/delete-imagen-add.component';
import { CreateVariationSpecificationsComponent } from './attributes/create-variation-specifications/create-variation-specifications.component';
import { EditVariationSpecificationsComponent } from './attributes/edit-variation-specifications/edit-variation-specifications.component';
import { DeleteVariationSpecificationsComponent } from './attributes/delete-variation-specifications/delete-variation-specifications.component';
import { CreateAnidadoVariationsComponent } from './attributes/create-anidado-variations/create-anidado-variations.component';
import { EditAnidadoVariationsComponent } from './attributes/edit-anidado-variations/edit-anidado-variations.component';

@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    DeleteProductComponent,
    ListsProductsComponent,
    DeleteImagenAddComponent,
    CreateVariationSpecificationsComponent,
    EditVariationSpecificationsComponent,
    DeleteVariationSpecificationsComponent,
    CreateAnidadoVariationsComponent,
    EditAnidadoVariationsComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    CKEditorModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ProductsModule { }
