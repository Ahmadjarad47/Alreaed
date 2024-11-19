import {
  AfterViewChecked,
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
export class NavbarComponent
  implements AfterViewInit, OnDestroy, AfterViewChecked
{
  @ViewChild('themeToggle', { static: false })
  themeToggle!: ElementRef<HTMLInputElement>;
  @ViewChild('isDarkChecked') isDarkChecked!: ElementRef<HTMLInputElement>;
  isDesktop: boolean = true;
  isDarkMode: boolean = false;
  resizeListener: any;
  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewChecked(): void {
    if (this.isDarkMode && this.isDarkChecked) {
      // Check if isDarkChecked is defined
      setTimeout(() => {
        if (this.isDarkChecked?.nativeElement) {
          // Ensure nativeElement is available
          this.isDarkChecked.nativeElement.checked = true;
        }
      }, 10);
    }
    this.cdr.detectChanges()
  }

  ngAfterViewInit(): void {
    this.checkScreenSize();

    // Check and apply the saved theme on initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);

      this.isDarkMode = savedTheme === 'dark';
    } else {
      document.documentElement.classList.add('light');
    }

    // Add resize event listener
    this.resizeListener = () => this.checkScreenSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    // Remove the resize listener when the component is destroyed
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkScreenSize(): void {
    // Update the isDesktop flag based on window width
    this.isDesktop = window.innerWidth > 800;
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
