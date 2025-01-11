import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { active } from './Models/active';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { userInfo } from '../core/Models/UserInfo';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private userNameObservable = new BehaviorSubject<userInfo>(new userInfo());
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  userName$ = this.userNameObservable.asObservable();
  http = inject(HttpClient);
  url = environment.baseAccountURL;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  confirmDeleteUser(token: string) {
    return this.http.post(`${this.url}confirm-delete?token=` + token, {});
  }

  Register(form: FormGroup) {
    return this.http.post(`${this.url}Register`, form);
  }

  Login(form: FormGroup) {
    return this.http.post(`${this.url}Login`, form);
  }

  ResetPassword(form: FormGroup) {
    return this.http.post(`${this.url}reset-password`, form);
  }

  Active(model: active) {
    return this.http.post(`${this.url}Active`, model);
  }

  getUserInfo() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<userInfo>(`${this.url}get-user-info`).pipe(
        map((m) => {
          if (m == null) {
            this.userNameObservable.next(new userInfo()); // Updates observable with the response

            console.log('Not Login', new userInfo());
          } else {
            this.userNameObservable.next(m); // Updates observable with the response
          }
        })
      );
    } else {
      console.log('SSR: Skipping API call');
      return null;
    }
  }

  logout() {
    return this.http.get(`${this.url}Logout`).pipe(
      map((m) => {
        this.userNameObservable.next(new userInfo());
        return m;
      })
    );
  }

  forgetPassword(email: string) {
    return this.http.get(`${this.url}forget-password?email=${email}`);
  }
  private checkAuthenticationStatus(): void {
    const url = environment.baseAccountURL + 'isAuth';
    this.http.get<boolean>(url, { withCredentials: true }).subscribe({
      next: (res) => this.isAuthenticatedSubject.next(true),
      error: (err) => this.isAuthenticatedSubject.next(false),
    });
  }

  // Public method to get the authentication status
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
