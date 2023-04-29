import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from 'src/app/components/nav-bar/nav-bar.component';
import { SideMenuComponent } from 'src/app/components/side-menu/side-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    NavBarComponent,
    SideMenuComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
  ],
  exports: [
    NavBarComponent,
    SideMenuComponent,
  ]
})
export class SharedModule { }
