import { isPlatformBrowser } from '@angular/common';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private flowbiteLoaded = false;

  // Dependency Injection of Spinner Service
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  // Injecting the spinner service
  spinService = inject(NgxSpinnerService);

  loadFlowbite(callback: (flowbite: any) => void) {
    if (isPlatformBrowser(this.platformId)) {
      import('flowbite').then(flowbite => {
        callback(flowbite);
    
      });
    }
  }

  RequestCount = 1;

  loading() {
    this.RequestCount++;
    this.spinService.show(undefined, {
      bdColor: 'rgba(0, 0, 0, 0.4)',
      size: 'large',
      color: '#fff',
      type: 'square-jelly-box.css',
      fullScreen: true,
    });
  }

  hideLoader() {
    this.RequestCount--;
    if (this.RequestCount <= 1) {
      this.RequestCount = 0;
      this.spinService.hide();
    }
  }
}
