import { AfterViewInit, Component, inject } from '@angular/core';
import { CoreService } from './core/core.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { initFlowbite } from 'flowbite';
declare var AOS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  flowbiteServiceAndSpin = inject(CoreService);
  router = inject(Router);

  ngAfterViewInit(): void {
    // Load Flowbite
    this.flowbiteServiceAndSpin.loadFlowbite((flowbite) => {
     
    });

    // Initialize AOS if it's available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });
    }

   // Optionally, subscribe to router events for loading spinner and AOS refresh
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        this.flowbiteServiceAndSpin.loading();
      } else if (
        ev instanceof NavigationEnd ||
        ev instanceof NavigationCancel ||
        ev instanceof NavigationError
      ) {
        this.flowbiteServiceAndSpin.loadFlowbite(f=>{f.initFlowbite()})

        this.flowbiteServiceAndSpin.hideLoader();
      }

      // Refresh AOS animations after route change
      if (typeof AOS !== 'undefined') {
       
        AOS.refresh();
      }
    });
  }

  isAccountPages(): boolean {
    return this.router.url.includes('/account');
  }
}
