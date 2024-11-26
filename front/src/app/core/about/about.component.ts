import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
declare var AOS: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent  {
   // Track hover state for each FAQ item
   faqHover: boolean[] = [false, false, false];
 
   @HostListener('window:scroll', ['$event'])
   onScroll(event: Event): void {
     this.checkVisibility();
   }
 
   checkVisibility(): void {
     const faqItems = document.querySelectorAll('.group');
     faqItems.forEach((faqItem, index) => {
       const rect = faqItem.getBoundingClientRect();
       // Check if the element is at least 50% visible in the viewport
       if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
         this.faqHover[index] = true;  // Apply hover effect to the current FAQ item
       } else {
         this.faqHover[index] = false;  // Remove hover effect from the current FAQ item
       }
     });
   }
}
