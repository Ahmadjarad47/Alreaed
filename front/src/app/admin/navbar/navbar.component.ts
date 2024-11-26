import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { userInfo } from '../../core/Models/UserInfo';
import { IdentityService } from '../../identity/identity.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit {
  isDarkMode = false;
  userinfo = new userInfo();
  _getUserInfo = inject(IdentityService);
  router = inject(Router);
  toast=inject(ToastrService)
  @ViewChild('isDarkChecked') isDarkChecked!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.classList.add(savedTheme);

        this.isDarkMode = savedTheme === 'dark';
      } else {
        document.documentElement.classList.add('light');
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
      // Add resize event listener
    }
    this._getUserInfo.getUserInfo().subscribe();
    this._getUserInfo.userName$.subscribe((m) => {
      this.userinfo = m;
    });
  }
  logout() {
    this._getUserInfo.logout().subscribe({
      next: (res:any) => {
        this.toast.warning(res.message, 'Warning');
        this.router.navigateByUrl('/');
      },
    });
  }
  toggleTheme(event: any): void {
    const theme = event.target.checked ? 'dark' : 'light';
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
