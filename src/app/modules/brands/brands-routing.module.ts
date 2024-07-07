import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands.component';
import { ListsBrandsComponent } from './lists-brands/lists-brands.component';

const routes: Routes = [
  {
    path: '',
    component: BrandsComponent,
    children: [
      {
        path: 'list',
        component: ListsBrandsComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule { }
