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
import { HomeProductComponent } from './core/CRUD/home-product/home-product.component';
import { CreateMessageComponent } from './inbox/create-message/create-message.component';
import { OrderComponent } from './order/order.component';
import { OrderProcessComponent } from './order/order-process/order-process.component';
import { PagnationComponent } from './core/pagnation/pagnation.component';


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
    HomeProductComponent,
    CreateMessageComponent,
    OrderComponent,
    OrderProcessComponent,
    PagnationComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    FormsModule
  ],exports:[
    NavbarComponent,
    PagnationComponent
  ]
})
export class AdminModule { }
