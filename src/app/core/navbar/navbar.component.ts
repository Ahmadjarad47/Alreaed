import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

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
  constructor(private cdr: ChangeDetectorRef) {}
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
    // this.cdr.detectChanges();
    // Check and apply the saved theme on initialization
   
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
