import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { INotification } from '../Models/notification';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-notification-user',
  templateUrl: './notification-user.component.html',
  styleUrls: ['./notification-user.component.css'], // Ensure the path is correct
})
export class NotificationUserComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.ReadNotificationWhenOpen();
  }
  readNotifications: INotification[] = [];
  toastr = inject(ToastrService);
  _service = inject(UserService);
  unreadNotifications: INotification[] = [];
  // Mock current user email for filtering
  ReadNotification(id: number): void {
    const ids: number[] = [];
    ids.push(id);
    this._service.readNotification(ids).subscribe({
      next: () => {
        this.getAllNotifications(); // Refresh notifications
        this.toastr.success('Notification marked as read!', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to mark notification as read.', 'Error');
      },
    });
  }
  id: number[] = [];

  ReadNotificationWhenOpen() {
    // Reset the ID array to avoid accumulating old IDs
    setTimeout(() => {
      for (let i = 0; i < this.unreadNotifications.length; i++) {
        this.id.push(this.unreadNotifications[i].id);
      }

      // Send the collected IDs to the service in a single request
      if (this.id.length > 0) {
        this._service.readNotification(this.id).subscribe({
          next: () => {
            this.toastr.success(
              'All unread notifications have been marked as read!',
              'Success'
            );
          },
          error: () => {
            this.toastr.error('Failed to mark notifications as read.', 'Error');
          },
        });
      }
    }, 3000);

    // Loop through the readNotifications and collect the IDs of unread notifications
  }

  ngOnInit(): void {
    this.getAllNotifications();
  }

  getAllNotifications(): void {
    this._service.getAllNotifications().subscribe({
      next: (value) => {
        this.unreadNotifications = value.filter((m) => m.isRead == false);
        this.readNotifications = value.filter((m) => m.isRead == true);

        // Filter notifications for the current user
      },
      error: (err) => {
        this.toastr.error('Failed to load notifications', 'Error');
        console.error(err);
      },
    });
  }
}
