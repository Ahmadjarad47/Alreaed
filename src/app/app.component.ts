import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CoreService } from './core/core.service';
declare var AOS: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements AfterViewInit, OnInit {
  constructor(private flowbiteService: CoreService) {}
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {});
  }
  ngAfterViewInit(): void {
    AOS.init({
      duration: 800, // Animation duration
      easing: 'ease-in-out', // Easing function
      once: 0, // Animation only once
      mirror: false, // Repeat animation on scroll up
    });
  }
}
