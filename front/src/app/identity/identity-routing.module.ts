import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ActiveComponent } from './active/active.component';
import { ResetPasswrodComponent } from './reset-passwrod/reset-passwrod.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'active', component: ActiveComponent },
  { path: 'reset-password', component: ResetPasswrodComponent },
  { path: 'delete-account', component: DeleteAccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentityRoutingModule {}
