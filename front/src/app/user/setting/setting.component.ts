import { Component, inject, OnInit } from '@angular/core';
import { UserSettings } from '../core/Models/setting';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { IdentityService } from '../../identity/identity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent implements OnInit {
  user: UserSettings | null = null; // User data
  isEditMode = false; // Controls edit/display mode
  identityService = inject(IdentityService);
  router = inject(Router);
  editUser: UserSettings = {
    id: '',
    userName: '',
    email: '',
    phoneNumber: '',
    city: '',
    balance: 0,
    emailConfirmed: false,
    image: '',
    createAccount: new Date(),
  };
  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUserSettings();
  }

  // Fetch user settings from the backend
  loadUserSettings(): void {
    this.userService.getUserSettings().subscribe({
      next: (data) => {
        this.editUser = new UserSettings(data);
        this.user = new UserSettings(data);
      },
      error: (err) => {
        console.error('Failed to load user settings:', err);
      },
    });
  }

  saveChanges(): void {
    this.userService.editUserSettings(this.editUser).subscribe({
      next: (response) => {
        this.editUser = response;
        this.isEditMode = false;
        this.loadUserSettings();
        this.toastr.info('User settings updated successfully!', 'Success');
      },
      error: (err) => {
        this.toastr.error('Failed to update user settings.', 'Error');
      },
    });
  }

  Logout(): void {
    this.identityService.logout().subscribe({
      next: (res: any) => {
        this.toastr.warning(res.message, 'Warning');

        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toastr.error('Logout failed', 'Error');
        console.error(err);
      },
    });
  }
  deleteUser() {
    this.userService.deleteUser().subscribe({
      next: () => {
        this.toastr.info(
          'A deletion confirmation email has been sent. Please check your email.',
          'Email Sent'
        );
      },
      error: (err) => {
        this.toastr.error(
          'Failed to send deletion token. Please try again.',
          'Error'
        );
        console.error(err);
      },
    });
  }
}
