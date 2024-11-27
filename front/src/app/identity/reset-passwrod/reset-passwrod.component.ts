import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { active } from '../Models/active';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-reset-passwrod',
  templateUrl: './reset-passwrod.component.html',
  styleUrl: './reset-passwrod.component.css',
})
export class ResetPasswrodComponent implements OnInit {
  ResetPassowrdGroup: FormGroup;
  fb = inject(FormBuilder);
  _service = inject(IdentityService);
  toast = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);
  router = inject(ActivatedRoute);
  route = inject(Router);
  param = new active();
  popoverVisible = false;
  InputType = 'password';
  constructor() {
    this.router.queryParams.subscribe((param) => {
      this.param.email = param['email'];
      this.param.token = param['token'];
    });
    this.ResetPassowrdGroup = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=.*\.)[A-Za-z\d@$!%*?&.]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  isPasswordStrong() {
    let strength = 0;
    if (this.ResetPassowrdGroup && this.ResetPassowrdGroup.value.password) {
      const password: string = this.ResetPassowrdGroup.value.password;
      const checks: { [key: string]: boolean } = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /[0-9]/.test(password),
        specialChar: /[@$!%*?&]/.test(password),
      };

      (Object.keys(checks) as (keyof typeof checks)[]).forEach((check) => {
        if (strength === 4) return;
        if (checks[check]) strength++;
      });

      return strength;
    }

    return strength;
  }

  passwordMatchValidator(form: FormGroup) {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');
    if (passwordControl?.value === confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors(null);
    } else {
      confirmPasswordControl?.setErrors({ passwordMisMatch: true });
    }
  }

  get _confirmPassword() {
    return this.ResetPassowrdGroup?.get('confirmPassword');
  }

  get _password() {
    return this.ResetPassowrdGroup?.get('password');
  }

  togglePopover(visible: boolean) {
    this.popoverVisible = visible;
    this.InputType = this.InputType === 'password' ? 'text' : 'password';
    const popover = document.getElementById('popover-password');
    if (popover) {
      if (visible) {
        popover.classList.remove('invisible', 'opacity-0');
        popover.classList.add('visible', 'opacity-100');
      } else {
        popover.classList.remove('visible', 'opacity-100');
        popover.classList.add('invisible', 'opacity-0');
      }
    }
  }


  
  ClosePop() {
    const popover = document.getElementById('popover-password');
    if (popover) {
      popover.classList.remove('visible', 'opacity-100');
      popover.classList.add('invisible', 'opacity-0');
    }
  }



  onSubmit() {
    const data: any ={
      password:this.ResetPassowrdGroup.value.password,
      email:this.param.email,
      token:this.param.token
    }
    console.log('data', data);

    if (this.ResetPassowrdGroup.valid) {
      this._service.ResetPassword(data).subscribe({
        next: (res: any) => {
          this.route.navigateByUrl("/account/login")
          this.toast.info(res.message, 'success'.toUpperCase());
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }
}
