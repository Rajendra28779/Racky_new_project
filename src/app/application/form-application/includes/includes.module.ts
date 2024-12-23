import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LeftmenuComponent } from './leftmenu/leftmenu.component';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert/alert.component';
import { UtilComponent } from './util/util.component';
import { TabsComponent } from './tabs/tabs.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LeftmenuComponent,
    AlertComponent,
    UtilComponent,
    TabsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    LeftmenuComponent,
    AlertComponent,
    UtilComponent,
    TabsComponent
  ]
})
export class IncludesModule { }
