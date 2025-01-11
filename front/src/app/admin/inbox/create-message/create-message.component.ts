import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { ReadMessage } from '../../core/Models/Message';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrl: './create-message.component.css',
})
export class CreateMessageComponent implements OnInit {
  id: number = 0; // Message ID retrieved from query params
  adminService = inject(AdminService); // Injecting AdminService
  route = inject(ActivatedRoute); // Injecting ActivatedRoute for query params
  sanitizer = inject(DomSanitizer); // Injecting DomSanitizer for HTML rendering
  toastService = inject(ToastrService); // Injecting ToastService for notifications
  message: ReadMessage[] = []; // Array to hold messages
  text: any; // Text to display the sanitized content (if needed)

  /**
   * Lifecycle hook to initialize the component
   */
  ngOnInit(): void {
    // Retrieve the 'id' parameter from the route query string
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });

    // Fetch messages by ID
    this.fetchMessages();
  }

  /**
   * Fetches messages by ID from the server and updates the state.
   */
  private fetchMessages(): void {
    this.adminService.getMessageById(this.id).subscribe({
      next: (res: ReadMessage[]) => {
        this.message = res;
        this.toastService.success('Messages loaded successfully!', 'Success'); // Show success toast
        if (res.length > 0) {
          this.markAsRead(res[0].emailForUser); // Mark the first message as read
        }
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
        this.toastService.error('Failed to load messages.', 'Error'); // Show error toast
      },
    });
  }

  /**
   * Marks a message as read by the admin after a delay.
   * @param email - The email of the user whose message is being marked as read.
   */
  private markAsRead(email: string): void {
    setTimeout(() => {
      this.adminService.ReadMessage(email).subscribe({
        next: () => {
          this.toastService.info('Message marked as read.', 'Info'); // Show informational toast
        },
        error: (err) => {
          console.error('Error marking message as read:', err);
          this.toastService.warning('Failed to mark message as read.', 'Warning'); // Show warning toast
        },
      });
    }, 10000); // Delay of 10 seconds
  }
}
