import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CoreService } from './core/core.service';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event as RouterEvent,
} from '@angular/router';

declare var AOS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private flowbiteServiceAndSpin = inject(CoreService);
  private router = inject(Router);

  ngOnInit(): void {
    if (typeof localStorage != 'undefined') {
      this.setLanguageDirection();
      this.initializeRouterEvents();
    }
  }

  ngAfterViewInit(): void {
    if (typeof localStorage != 'undefined') {
      this.initializeFlowbite();
      this.initializeAOS();
    }
  
  }

  private setLanguageDirection(): void {
    const language = localStorage?.getItem('language') || 'en';
    document.documentElement.setAttribute('lang', language);
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
  }

  private initializeFlowbite(): void {
    this.flowbiteServiceAndSpin.loadFlowbite((flowbite) => {
      flowbite.initFlowbite();
    });
  }

  private initializeAOS(): void {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600, // Reduced for better performance
        easing: 'ease-in-out',
        once: true, // Only animate once
        mirror: false,
      });
    }
  }

  private initializeRouterEvents(): void {
    this.router.events.subscribe({
      next: (event: RouterEvent) => this.handleRouterEvent(event),
      error: (err) => console.error('Router event error:', err),
    });
  }

  private handleRouterEvent(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.flowbiteServiceAndSpin.loading();
    } else if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.onNavigationComplete();
    }
  }

  private onNavigationComplete(): void {
    this.flowbiteServiceAndSpin.hideLoader();
    this.flowbiteServiceAndSpin.loadFlowbite((flowbite) =>
      flowbite?.initFlowbite()
    );

    if (typeof AOS !== 'undefined') {
      AOS.refreshHard(); // Use `refreshHard` for better animation recalculation
    }
  }

  isAccountPages(): boolean {
    const accountPaths = ['/dashboard','/account', '/admin',];
    return accountPaths.some((path) => this.router.url.includes(path));
  }
}
