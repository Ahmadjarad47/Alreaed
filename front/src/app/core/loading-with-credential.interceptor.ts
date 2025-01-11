import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CoreService } from './core.service'; // Adjust the path as needed
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class loadingWithCredentialInterceptor implements HttpInterceptor {
  constructor(
    private _service: CoreService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add withCredentials flag
    request = request.clone({
      withCredentials: true,
    });

    if (isPlatformBrowser(this.platformId)) {
      // Only show loader in the browser environment
      this._service.loading();

      return next.handle(request).pipe(
        finalize(() => {
          this._service.hideLoader();
        })
      );
    } 

    // Handle the request normally on the server
    return next.handle(request);
  }
}
