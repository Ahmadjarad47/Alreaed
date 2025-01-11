import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './core/user-home/user-home.component';
import { OrderComponent } from './order/order.component';
import { SettingComponent } from './setting/setting.component';
import { NotificationUserComponent } from './core/notification-user/notification-user.component';
import { OrderHomeComponent } from './order/order-home/order-home.component';

const routes: Routes = [
  {path:'',component:UserHomeComponent},
  // Create order
  {path:'create-order',component:OrderComponent},
  {path:'order-home',component:OrderHomeComponent},
  {path:'setting',component:SettingComponent},
  {path:'notification',component:NotificationUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
