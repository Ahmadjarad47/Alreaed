import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagnation',
  templateUrl: './pagnation.component.html',
  styleUrl: './pagnation.component.css'
})
export class PagnationComponent {
  @Input() pageSize ;
  @Input() totalRecords;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  currentPage: number = 1;
  totalPages: number = 1;

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
   
    
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage);
      
      
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPagesArray(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  getVisiblePages(): number[] {
    const totalDisplayedPages = 7; // Set the number of pages you want to display
    const pages = [];
  
    if (this.totalPages <= totalDisplayedPages) {
      // Show all pages if total pages are less than the displayed number
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        // Show first 5 pages and last two
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // For ellipsis
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        // Show first page, ellipsis, and last 5 pages
        pages.push(1);
        pages.push(-1); // For ellipsis
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current page, ellipsis, and last page
        pages.push(1);
        pages.push(-1); // For ellipsis
        pages.push(this.currentPage - 1);
        pages.push(this.currentPage);
        pages.push(this.currentPage + 1);
        pages.push(-1); // For ellipsis
        pages.push(this.totalPages);
      }
    }
    return pages;
  }
  
}
