import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeViewRoutingModule } from './home-view-routing.module';
import { HomeViewComponent } from './home-view.component';
import { EditHomeComponent } from './edit-home/edit-home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { EditHomeViewComponent } from './edit-home-view/edit-home-view.component';


@NgModule({
  declarations: [
    HomeViewComponent,
    EditHomeComponent,
    EditHomeViewComponent
  ],
  imports: [
    CommonModule,
    HomeViewRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class HomeViewModule { }
