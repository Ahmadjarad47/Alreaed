import { userInfo } from './../Models/UserInfo';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CoreService } from '../core.service';
import { IdentityService } from '../../identity/identity.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('themeToggle', { static: false })
  themeToggle!: ElementRef<HTMLInputElement>;

  @ViewChild('isDarkChecked') isDarkChecked!: ElementRef<HTMLInputElement>;

  isDesktop: boolean = true;
  isDarkMode: boolean = false;
  resizeListener: any;
  language: any;
  userInfo = new userInfo();
  private subscriptions: Subscription[] = [];

  // Services
  private identityService = inject(IdentityService);
  private toastr = inject(ToastrService);
  private coreService = inject(CoreService);
  private router = inject(Router);

  ngOnInit(): void {
    if (typeof localStorage != 'undefined') {
      this.initializeSettings();
      this.initializeUserInfo();
      this.addResizeListener();
    }
  }
fixInitDropDown(){
  this.coreService.loadFlowbite(f=>f.initFlowbite()); 
}

  ngOnDestroy(): void {
    this.removeResizeListener();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private initializeSettings(): void {
    this.checkScreenSize();
    this.applySavedLanguage();
    this.applySavedTheme();
    this.coreService.lang$.subscribe((val) => {
      this.language = val;
    });
  }

  private initializeUserInfo(): void {
    this.identityService.getUserInfo().subscribe();

    // Subscribe to the userName$ observable
    const userSubscription = this.identityService.userName$.subscribe(
      (user) => {
        if (user) {
          this.userInfo.name = user.name || ''; // Safely set name
          this.userInfo.email = user.email || ''; // Safely set email
        } else {
          this.userInfo.name = ''; // Default empty string if user is null
          this.userInfo.email = '';
        }
      }
    );

    // Store subscription for later cleanup
    this.subscriptions.push(userSubscription);
  }
  private addResizeListener(): void {
    if (typeof window !== 'undefined') {
      this.resizeListener = () => this.checkScreenSize();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  private removeResizeListener(): void {
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkScreenSize(): void {
    if (typeof window != 'undefined') {
      this.isDesktop = window.innerWidth > 800;
    }
  }

  setLanguage(lan: string) {
    const newlanguage = lan == 'en' ? 'ar' : 'en';

    localStorage.setItem('language', newlanguage);
    this.subscripNewLanguage(newlanguage);
  }

  subscripNewLanguage(language: string): void {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    this.coreService.LanguageObservable.next(language);
  }

  private applySavedLanguage(): void {
    const savedLanguage = localStorage.getItem('language') || 'en';

    this.subscripNewLanguage(savedLanguage);
  }

  private applySavedTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(savedTheme);

    setTimeout(() => {
      if (this.isDarkChecked?.nativeElement) {
        this.isDarkChecked.nativeElement.checked = this.isDarkMode;
      }
    }, 10);
  }

  toggleTheme(event: Event): void {
    const isDarkMode = (event.target as HTMLInputElement).checked;
    const theme = isDarkMode ? 'dark' : 'light';
    this.applyTheme(theme);
  }

  toggleThemeButtonNavbar(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.applyTheme(theme);
  }

  private applyTheme(theme: string): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme !== 'dark');
    localStorage.setItem('theme', theme);
  }

  Logout(): void {
    this.identityService.logout().subscribe({
      next: (res: any) => {
        this.toastr.warning(res.message, 'Warning');
        this.coreService.loadFlowbite((flowbite) => {
          flowbite?.initDropdowns();
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Logout failed', 'Error');
        console.error(err);
      },
    });
  }
}
