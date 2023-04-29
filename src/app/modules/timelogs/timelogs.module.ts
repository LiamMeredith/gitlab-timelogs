import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TimelogsComponent } from './timelogs.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared/shared.module';

const routes: Routes = [
  { path: '', component: TimelogsComponent },
];

@NgModule({
  declarations: [TimelogsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TimelogsModule { }
