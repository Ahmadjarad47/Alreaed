import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { NavbarComponent } from './core/navbar/navbar.component';
import { UserHomeComponent } from './core/user-home/user-home.component';
import { OrderComponent } from './order/order.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import { SettingComponent } from './setting/setting.component';
import { NotificationUserComponent } from './core/notification-user/notification-user.component';
import { OrderHomeComponent } from './order/order-home/order-home.component';
import { PagnationComponent } from './core/shared/pagnation/pagnation.component';

@NgModule({
  declarations: [
   PagnationComponent, NavbarComponent, UserHomeComponent, OrderComponent, SettingComponent, NotificationUserComponent, OrderHomeComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule
  ],
  exports: [NavbarComponent,PagnationComponent],
})
export class UserModule {}
