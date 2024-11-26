import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { InboxComponent } from './inbox/inbox.component';
import { HeroComponent } from './core/CRUD/hero/hero.component';
import { HomeAboutComponent } from './core/CRUD/home-about/home-about.component';

const routes: Routes = [
  {path:'dashboard',component:AdminHomeComponent},
  {path:'users',component:UsersComponent},
  {path:'inbox',component:InboxComponent},
  {path:'hero',component:HeroComponent},
  {path:'home-about',component:HomeAboutComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
