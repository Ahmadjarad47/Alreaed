import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityService } from '../identity/identity.service';

@Injectable({
  providedIn: 'root',
})
export class CredentailInterceptor implements HttpInterceptor {
  constructor(private authService: IdentityService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.isAuthenticated()) {
      
      request = request.clone({
        withCredentials: true, // Include credentials if authenticated
      });
    }
    return next.handle(request); // Continue with the request
  }
}
