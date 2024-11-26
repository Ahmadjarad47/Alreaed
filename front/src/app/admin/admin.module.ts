import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersComponent } from './users/users.component';
import { RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { InboxComponent } from './inbox/inbox.component';
import { HeroComponent } from './core/CRUD/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { HomeAboutComponent } from './core/CRUD/home-about/home-about.component';
import { ServiceComponent } from './core/CRUD/service/service.component';
import { SubserviceComponent } from './core/CRUD/subservice/subservice.component';


@NgModule({
  declarations: [
  
    NavbarComponent,
    UsersComponent,
    AdminHomeComponent,
    InboxComponent,
    HeroComponent,
    HomeAboutComponent,
    ServiceComponent,
    SubserviceComponent,
 
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    FormsModule
  ],exports:[
    NavbarComponent,
    // ChartsComponent
  ]
})
export class AdminModule { }
