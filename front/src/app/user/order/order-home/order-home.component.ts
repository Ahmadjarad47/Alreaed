import { Component, OnInit } from '@angular/core';
import { Paging } from '../../core/Models/UserOrder';
import { UserService } from '../../user.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-order-home',
  templateUrl: './order-home.component.html',
  styleUrls: ['./order-home.component.css'], // Use an advanced style file
})
export class OrderHomeComponent implements OnInit {
  orders: Paging = new Paging();
  url = environment.base;
  orderStatuses = [
    { value: '', label: 'All', description: 'View all orders' },
    {
      value: 'Pending',
      label: 'Pending',
      description: 'Orders waiting for approval',
    },
    {
      value: 'InProcess',
      label: 'In Process',
      description: 'Orders currently being processed',
    },
    {
      value: 'Rejected',
      label: 'Rejected',
      description: 'Orders that have been rejected',
    },
    {
      value: 'Completed',
      label: 'Completed',
      description: 'Orders successfully completed',
    },
  ];

  // UI State
  panelColor = new FormControl('');
  progress: number = -1; // Download progress tracker (-1 = idle, 0-100 = downloading)
  isLoading: boolean = false; // Loading indicator for API calls

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  /** Fetch all orders with current filters */
  getAllOrders(): void {
    this.isLoading = true; // Show loading indicator
    this.userService.getAllOrders(this.orders).subscribe({
      next: (response) => {
        this.orders = response;
        this.toastr.success('Orders loaded successfully', 'Success');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to load orders', 'Error');
      },
      complete: () => {
        this.isLoading = false; // Hide loading indicator
      },
    });
  }

  /** Handle search by order status or word */
  searchByWord(search: string): void {
    if (search) {
      this.orders.search = search;
      this.getAllOrders();
    } 
  }

  /** Update order status filter and reload orders */
  filterByStatus(status: string): void {
    if (this.orderStatuses.some((s) => s.value === status)) {
      this.orders.status = status;
      this.getAllOrders();
    }
  }

  /** Handle pagination changes */
  onChangePage(event: number): void {
    if (this.orders.pageNumber !== event) {
      this.orders.pageNumber = event;
      this.getAllOrders();
    }
  }

  /** Download a file with progress tracking */
  downloadFile(src: string): void {
    const fileUrl = `${this.url}${src}`;
    this.http
      .get(fileUrl, {
        responseType: 'blob',
        observe: 'events',
        reportProgress: true,
      })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.progress = event.total
              ? Math.round((event.loaded / event.total) * 100)
              : 0;
          } else if (event.type === HttpEventType.Response) {
            this.handleFileDownload(event.body!, '1_compressed.zip');
          }
        },
        error: (error) => {
          console.error('Download failed', error);
          this.toastr.error('File download failed', 'Error');
          this.progress = -1;
        },
      });
  }

  /** Helper to handle file download */
  private handleFileDownload(data: Blob, fileName: string): void {
    const blob = new Blob([data], { type: 'application/zip' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    this.toastr.success('File downloaded successfully', 'Success');
    this.progress = -1; // Reset progress
  }
}
