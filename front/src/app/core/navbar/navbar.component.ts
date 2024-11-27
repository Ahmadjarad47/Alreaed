import { userInfo } from './../Models/UserInfo';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CoreService } from '../core.service';
import { IdentityService } from '../../identity/identity.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('themeToggle', { static: false })
  themeToggle!: ElementRef<HTMLInputElement>;
  @ViewChild('isDarkChecked') isDarkChecked!: ElementRef<HTMLInputElement>;
  isDesktop: boolean = true;
  isDarkMode: boolean = false;
  resizeListener: any;
  getUserName = inject(IdentityService);
  toast = inject(ToastrService);
  router = inject(CoreService);
  userinfo = new userInfo();
  ngOnInit(): void {
    this.checkScreenSize();

    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.classList.add(savedTheme);

        this.isDarkMode = savedTheme === 'dark';
      } else {
        document.documentElement.classList.add('light');
      }

      // Add resize event listener
      this.resizeListener = () => this.checkScreenSize();
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', this.resizeListener);
      }
    }

    if (this.isDarkMode) {
      // Check if isDarkChecked is defined
      setTimeout(() => {
        if (this.isDarkChecked?.nativeElement) {
          // Ensure nativeElement is available
          this.isDarkChecked.nativeElement.checked = true;
        }
      }, 10);
    }

    // this.getUserName.getUserInfo().subscribe();
    this.getUserName.userName$.subscribe((m) => {
      if (m) {
        this.userinfo.name = m.name || '';
        this.userinfo.email = m.email || '';
      }
    });
    //  this.cdr.detectChanges();
    // Check and apply the saved theme on initialization
  }
  Logout() {
    this.getUserName.logout().subscribe({
      next: (res: any) => {
        this.toast.warning(res.message, 'Warning');
        this.router.loadFlowbite((f) => {
          f.initDropdowns();
        });
      },
    });
  }
  ngOnDestroy(): void {
    // Remove the resize listener when the component is destroyed
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      this.isDesktop = window.innerWidth > 800;
    }
  }

  toggleTheme(event: any): void {
    const theme = event.target.checked ? 'dark' : 'light';
    this.applyTheme(theme);
  }

  toggleThemeButtonNavbar(): void {
    // Toggle dark mode
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.applyTheme(theme);
  }

  private applyTheme(theme: string): void {
    if (typeof localStorage !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }
}
