import { Component, OnInit, AfterViewChecked } from '@angular/core';
declare var AOS:any
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit  {
  ngOnInit(): void {
    
    AOS.init({
      duration: 800, // Animation duration
      easing: 'ease-in-out', // Easing function
      once: 0, // Animation only once
      mirror: false, // Repeat animation on scroll up
    });
  }


}
