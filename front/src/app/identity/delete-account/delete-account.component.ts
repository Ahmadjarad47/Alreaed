import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IdentityService } from '../identity.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css',
})
export class DeleteAccountComponent {
  token!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject the Router for navigation
    private userService: IdentityService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Extract token from the URL
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];

      if (!this.token) {
        this.toastr.error('Invalid or missing URL parameters.', 'Error');
      }
    });
  }

  confirmDelete() {
    if (!this.token) {
      this.toastr.error('Missing token.', 'Error');
      return;
    }

    this.userService.confirmDeleteUser(this.token).subscribe({
      next: () => {
        this.toastr.success(
          'Your account has been deleted successfully.',
          'Success'
        );
        this.router.navigate(['/']); // Redirect to home page
      },
      error: (err) => {
        this.toastr.error(
          'Invalid token or token expired. Please try again.',
          'Error'
        );
        console.error(err);
      },
    });
  }

  ignoreAction() {
    this.router.navigate(['/']); // Redirect to the home page
  }
}
