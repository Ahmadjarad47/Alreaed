import { AfterContentInit, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterContentInit {
  ngAfterContentInit(): void {
    this.registerGroup = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(35)],
      ],
      password: [
        '',
        [
          Validators.required,
        
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
  }
  fb = inject(FormBuilder);
  toast = inject(ToastrService);
  registerGroup: FormGroup;
  onSubmit(){

  }
}
