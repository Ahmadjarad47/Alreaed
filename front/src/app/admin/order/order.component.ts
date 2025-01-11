import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Paging } from '../core/Models/OrderModels';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';
import { CoreService } from '../../core/core.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit, AfterViewInit {
  // State management for sidebar visibility
  public isSidebarClosed: boolean = false;
  public search: string = '';
  public rejectedMessage: string = '';
  // orderId to Set order In Process
  public orderId: number = 0;
  // Dependency injections
  private adminService = inject(AdminService); // AdminService for API interactions
  private toastr = inject(ToastrService); // ToastrService for notifications
  private coreService = inject(CoreService); // CoreService for UI utilities
  private router = inject(Router); // CoreService for UI utilities
  activeTab: string = 'orderInfo';

  Orders: Paging = new Paging(); // Initialize with an empty object or array

  /**
   * Angular lifecycle hook: Runs after the component is initialized.
   * Used to load initial data like orders.
   */
  ngOnInit(): void {
    this.loadOrders(); // Load orders data
    this.toastr.info('Orders is loaded', 'SUCCESS');
  }

  /**
   * Angular lifecycle hook: Runs after the component's view is initialized.
   * Used for UI state management and initializing external libraries.
   */
  ngAfterViewInit(): void {
    this.subscribeToSidebarState(); // Manage sidebar state
    this.initializeFlowbite(); // Initialize Flowbite library
  }

  /**
   * Fetches paginated order data and updates the state.
   */
  private loadOrders(): void {
    this.adminService.getAllOrders(this.Orders).subscribe({
      next: (response: Paging) => {
        console.log('Orders fetched:', response); // Debug log for successful API response
        this.Orders = response; // Update the orders state
        console.log(this.Orders);
      },
      error: (err) => {
        console.error('Error fetching orders:', err); // Log API errors
        this.toastr.error('Failed to load orders.', 'Error'); // Display error notification
      },
    });
  }

  /**
   * Returns dynamic CSS classes based on the order status.
   * @param status - The status of the order (e.g., Pending, Rejected, Completed).
   */
  public getStatusClasses(status: string): string {
    const classes: Record<string, string> = {
      Pending:
        'text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2',
      Rejected:
        'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2',
      Completed:
        'text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2',
      InProcess:
        'text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2',
    };
    return classes[status] || ''; // Default to an empty string if the status is unrecognized
  }

  /**
   * submit to set order in process
   * @param order_id
   */
  public onSubmitSetOrderInProcess() {
    if (
      this.Orders.data.find((m) => m.id == this.orderId).status == 'InProcess'
    ) {
      this.toastr.error("it's already pending", 'ERROR');
      return;
    }
    this.adminService.InProcessOrder(this.orderId).subscribe({
      next: (res) => {
        this.toastr.info('Order In Process', 'SUCCESS');
        this.router.navigateByUrl('/admin/order-process');
        this.loadOrders();
      },
      error: (err) => {
        this.toastr.error('Something went wrong', 'ERROR');
        console.log(err);
      },
    });
  }
  public onChangeStatusToPending() {
    if (
      this.Orders.data.find((m) => m.id == this.orderId).status == 'Pending'
    ) {
      this.toastr.error("it's already pending", 'ERROR');
      return;
    }
    this.adminService.ChangeStatusToPending(this.orderId).subscribe({
      next: (res) => {
        this.toastr.warning('Chnage to pending success', 'WARNING');
        this.loadOrders();
      },
      error(err) {
        console.log(err);
      },
    });
  }
  public onChangeStatusToReject() {
    if (this.rejectedMessage == '') {
      this.toastr.warning('please write a text can not be null', 'WARNING');
      return;
    }
    this.adminService
      .ChangeStatusToReject(this.orderId, this.rejectedMessage)
      .subscribe({
        next: (res) => {
          this.toastr.warning('Chnage to Rejected success', 'WARNING');
          this.loadOrders();
          this.rejectedMessage = '';
          document.getElementById('closeRejectModal').click();
        },
        error(err) {
          console.log(err);
        },
      });
  }
  public SearchUsingWord() {
    this.Orders.search = this.search;
    this.loadOrders();
  }
  /**
   * Downloads a file from the given file path.
   * @param filePath - The relative path to the file.
   */
  public downloadFile(filePath: string): void {
    const downloadUrl = `${environment.base}${filePath}`; // Construct the full download URL
    const anchor = document.createElement('a'); // Create a hidden anchor element
    anchor.href = downloadUrl;
    anchor.download = ''; // Optional: Specify a custom file name
    document.body.appendChild(anchor); // Append the anchor to the DOM
    anchor.click(); // Trigger the download
    document.body.removeChild(anchor); // Clean up by removing the anchor
  }

  /**
   * Handles page change events from the pagination component.
   * @param event - The new page number.
   */
  public onChangePage(event: number): void {
    if (this.Orders.pageNumber !== event) {
      this.Orders.pageNumber = event; // Update the current page number
      this.loadOrders(); // Reload orders data for the new page
    }
  }

  /**
   * Subscribes to changes in sidebar state and updates the component state.
   */
  private subscribeToSidebarState(): void {
    this.adminService.isOpen$.subscribe((isOpen: boolean) => {
      this.isSidebarClosed = isOpen; // Update sidebar visibility
    });
  }

  /**
   * Initializes the Flowbite library with a debounce to ensure proper timing.
   */
  private initializeFlowbite(): void {
    setTimeout(() => {
      this.coreService.loadFlowbite((module) => module.initFlowbite()); // Initialize Flowbite
    }, 1000); // Delay to ensure DOM is ready
  }
}
