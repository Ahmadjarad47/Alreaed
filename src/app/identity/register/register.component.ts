import { AfterContentInit, AfterViewChecked, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements AfterContentInit {
  fb = inject(FormBuilder);
  toast=inject(ToastrService)
  registerGroup: FormGroup;
  popoverVisible = false;
  InputType = 'password';
  ngAfterContentInit(): void {
    this.registerGroup = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(35)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8), // Changed to match the pattern
            Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=.*\.)[A-Za-z\d@$!%*?&.]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

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
  onSubmit(): void {
    console.log(this.registerGroup.value);
    console.log(this.registerGroup.valid);
   
  
     this.toast.info("User Register Successfuly",'success'.toUpperCase())
  }

  isPasswordStrong() {
    let strength = 0;

    if (3 >= strength) {
      const password: string = this.registerGroup.value.password;
      const checks: { [key: string]: boolean } = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /[0-9]/.test(password),
        specialChar:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=.*\.)[A-Za-z\d@$!%*?&.]{8,}$/.test(password),
      };
      // Increment strength based on criteria met
      (Object.keys(checks) as (keyof typeof checks)[]).forEach((check) => {
        if (strength === 4) return; // Early exit if strength is sufficient
        if (checks[check]) strength++;
      });

      return strength;
    }

    return 3;
  }


  // Toggle popover visibility
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
    popover.classList.remove('invisible', 'opacity-0');
    popover.classList.add('visible', 'opacity-100');
  }


  get _username() {
    return this.registerGroup.get('username');
  }
  get _email() {
    return this.registerGroup.get('email');
  }
  get _password() {
    return this.registerGroup.get('password');
  }
  get _confirmPassword() {
    return this.registerGroup.get('confirmPassword');
  }
}
