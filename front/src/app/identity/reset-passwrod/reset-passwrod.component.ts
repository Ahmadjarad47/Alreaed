import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-passwrod',
  templateUrl: './reset-passwrod.component.html',
  styleUrl: './reset-passwrod.component.css',
})
export class ResetPasswrodComponent implements OnInit {
  ResetPassowrdGroup: FormGroup;
  fb = inject(FormBuilder);
  toast = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);
  popoverVisible = false;
  InputType = 'password';

  constructor() {
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
  onSubmit(){
    this.toast.info('Reset-password','success'.toUpperCase())
  }
}
