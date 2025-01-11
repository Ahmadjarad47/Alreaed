import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityRoutingModule } from './identity-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswrodComponent } from './reset-passwrod/reset-passwrod.component';
import { ActiveComponent } from './active/active.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetPasswrodComponent,
    ActiveComponent,
    DeleteAccountComponent,
  ],
  imports: [
    CommonModule,
    IdentityRoutingModule,
    ReactiveFormsModule,  
    FormsModule,
  ],
})
export class IdentityModule {}
