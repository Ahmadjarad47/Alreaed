import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrl: './bubble.component.css'
})
export class BubbleComponent {
@Input()top:number = 0;
@Input()top2:number = 0;
@Input()bottom:number = 0;
@Input()bottom2:number = 0;
}
