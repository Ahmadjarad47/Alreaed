import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpClient,
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CoreService } from './core.service'; // Adjust the path as needed
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class loadingWithCredentialInterceptor implements HttpInterceptor {
  constructor(private _service: CoreService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this._service.loading();

    

    return next.handle(request).pipe(
      finalize(() => {
        this._service.hideLoader();
      })
    );
  }
}
