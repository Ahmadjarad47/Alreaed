import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ServiceComponent } from './service/service.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { PriceComponent } from './price/price.component';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    ServiceComponent,
    FooterComponent,
    AboutComponent,
    PriceComponent,
    NotfoundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Position of the toast
      preventDuplicates: false, // Prevent duplicate toasts
      closeButton: true,
      progressBar: true,
      tapToDismiss: true,
      timeOut: 3000,
      titleClass: 'titleToast',
      messageClass: 'messageToast',
      toastClass: 'toastToast',
    }),
  ],
  exports: [NavbarComponent, FooterComponent],
})
export class CoreModule {}