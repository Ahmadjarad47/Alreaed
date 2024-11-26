import { AfterContentInit, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from '../../core/core.service';
import { initFlowbite } from 'flowbite';
import { IdentityService } from '../identity.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterContentInit {
  fb = inject(FormBuilder);
  toast = inject(ToastrService);
  flow = inject(CoreService);
  _service = inject(IdentityService);
  LoginGroup: FormGroup;
  router = inject(ActivatedRoute);
  returnUrl = '/';
  emailModel = '';
  url = inject(Router);
  ngAfterContentInit(): void {
    this.router.queryParams.subscribe((param) => {
      this.returnUrl = param['returnUrl'] || '/';
    });
    this.flow.loadFlowbite((f) => {
      f.initFlowbite();
    });
    this.LoginGroup = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(35)],
      ],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.LoginGroup.valid) {
      this._service.Login(this.LoginGroup.value).subscribe({
        next: (res: any) => {
          this.url.navigateByUrl(this.returnUrl);
          this.toast.info(res.message, 'success'.toUpperCase());
          this._service.getUserInfo().subscribe();
        },
        error: (err: any) => {
          // Extract and join error messages if they exist
          console.log(err);

          // Extract and join all error messages
          const errorMessages = err?.error?.errors
            ? Object.values(err.error.errors) // Get all property values (arrays of messages)
                .flat() // Flatten the arrays into a single array
                .join(' | ') // Join all messages with a separator
            : err?.error?.title || err.error.message; // Fallback message if no errors

          this.toast.error(errorMessages, 'error'.toUpperCase());
        },
      });
    }
    // this.toast.info('Login success', 'Welcome-Back');
  }
  onSubmitForgetPassword() {
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (regexp.test(this.emailModel)) {
      this.toast.info('Email send Success', 'SUCCESS');
    } else {
      this.toast.error('Email Format Invalid', 'ERROR');
    }
  }
}
