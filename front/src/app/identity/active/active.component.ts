import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { active } from '../Models/active';
import { IdentityService } from '../identity.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrl: './active.component.css',
})
export class ActiveComponent implements AfterViewInit {
  isAccountActive: boolean = false;
  data = new active();
  _service = inject(IdentityService);
  toast = inject(ToastrService);
  router = inject(ActivatedRoute);
  ngAfterViewInit(): void {
    this.router.queryParams.subscribe((param) => {
      this.data.email = param['email'];
      this.data.token = param['token'];
    });

    if (this.data.email != '' || this.data.token != '') {
      this._service.Active(this.data).subscribe({
        next: (res: any) => {
          // Check if the response indicates success
          if (res?.statusCode === 200) {
            this.isAccountActive = true;
            this.toast.success('Account successfully activated!', 'SUCCESS');
          } else {
            // Handle unexpected success responses gracefully
            this.toast.warning(
              'Unexpected response. Please verify.',
              'WARNING'
            );
          }
        },
        error: (err: any) => {
          // Extract and join error messages if they exist
          if (err.error.message == 'Invalid email or token.') {
            console.log(err);

            // Extract and join all error messages
            const errorMessages = err?.error?.errors
              ? Object.values(err.error.errors) // Get all property values (arrays of messages)
                  .flat() // Flatten the arrays into a single array
                  .join(' | ') // Join all messages with a separator
              : err?.error?.title || err.error.message || 'An error occurred.'; // Fallback message

            this.toast.error(errorMessages, 'ERROR');
          }
        },
      });
    }
  }
}
