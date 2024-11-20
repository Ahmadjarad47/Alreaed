import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ActiveComponent } from './active/active.component';
import { ResetPasswrodComponent } from './reset-passwrod/reset-passwrod.component';

const routes: Routes = [
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'active',component:ActiveComponent},
  {path:'reset-password',component:ResetPasswrodComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class IdentityRoutingModule { }
