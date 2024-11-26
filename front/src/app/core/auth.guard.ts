import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {
  const url = environment.baseAccountURL;
  const http = inject(HttpClient);
  const router = inject(Router);
  
  http.get(url + 'isAuth').subscribe({
    next: (res) => {
      return true;
    },
    error: (err) => {
      router.navigate(['/account/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    },
  });
  return true;
};
