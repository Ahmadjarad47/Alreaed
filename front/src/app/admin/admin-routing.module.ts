import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { InboxComponent } from './inbox/inbox.component';
import { HeroComponent } from './core/CRUD/hero/hero.component';
import { HomeAboutComponent } from './core/CRUD/home-about/home-about.component';
import { ServiceComponent } from './core/CRUD/service/service.component';
import { SubserviceComponent } from './core/CRUD/subservice/subservice.component';
import { HomeProductComponent } from './core/CRUD/home-product/home-product.component';
import { CreateMessageComponent } from './inbox/create-message/create-message.component';
import { OrderComponent } from './order/order.component';
import { OrderProcessComponent } from './order/order-process/order-process.component';

const routes: Routes = [
  {path:'dashboard',component:AdminHomeComponent},
  {path:'users',component:UsersComponent},
  {path:'inbox',component:InboxComponent},
  {path:'inbox/create',component:CreateMessageComponent},
  {path:'hero',component:HeroComponent},
  {path:'home-about',component:HomeAboutComponent},
  {path:'service',component:ServiceComponent},
  {path:'sub-service',component:SubserviceComponent},
  {path:'home-product',component:HomeProductComponent},
  {path:'order',component:OrderComponent},
  {path:'order-process',component:OrderProcessComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
