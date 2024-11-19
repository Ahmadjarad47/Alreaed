import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CoreService } from './core/core.service';

import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
declare var AOS: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements  AfterViewInit {
  constructor(private flowbiteService: CoreService) {}
  router=inject(Router)
  spin=inject(CoreService)
  ngAfterViewInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {});
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800, // Animation duration
        easing: 'ease-in-out', // Easing function
        once: 0, // Animation only once
        mirror: false, // Repeat animation on scroll up
      });
    }
    this.router.events.subscribe(ev=>{
      if(ev instanceof NavigationStart){
        this.spin.loading()
      }else if (ev instanceof NavigationEnd || ev instanceof NavigationCancel || ev instanceof NavigationError) {
        this.spin.hideLoader();
      }
      if (typeof AOS !== 'undefined') {
      AOS.refresh();
      }
    })
  }
  
}
