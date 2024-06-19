import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [CrudComponent],
  imports: [
    CommonModule, DataTablesModule,
    NgbModalModule,
  ],
  exports: [CrudComponent]
})
export class CrudModule { }
