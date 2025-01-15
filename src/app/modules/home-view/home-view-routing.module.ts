import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeViewComponent } from './home-view.component';
import { EditHomeComponent } from './edit-home/edit-home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent,
    children: [
      {
        path: 'edit-home',
        component: EditHomeComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeViewRoutingModule { }
