import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersComponent } from './users/users.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule
  ],exports:[
    NavbarComponent
  ]
})
export class AdminModule { }
