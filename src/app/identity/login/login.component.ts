import { AfterContentInit, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from '../../core/core.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterContentInit {
  fb = inject(FormBuilder);
  toast = inject(ToastrService);
  flow = inject(CoreService);
  LoginGroup: FormGroup;
  
  emailModel = '';
  ngAfterContentInit(): void {
    this.flow.loadFlowbite(f=>{})
    this.LoginGroup = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(35)],
      ],
      password: ['', [Validators.required]],
     
    });
  }

  onSubmit() {
    this.toast.info('Login success', 'Welcome-Back');
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
