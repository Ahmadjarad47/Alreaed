import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { ServiceComponent } from './core/service/service.component';
import { AboutComponent } from './core/about/about.component';
import { PriceComponent } from './core/price/price.component';
import { NotfoundComponent } from './core/notfound/notfound.component';
import { ContactComponent } from './core/contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pricing', component: PriceComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'service',
    component: ServiceComponent,
  },

  {
    path: 'account',
    loadChildren: () =>
      import('./identity/identity.module').then((mod) => mod.IdentityModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((mod) => mod.AdminModule),
  },

  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
