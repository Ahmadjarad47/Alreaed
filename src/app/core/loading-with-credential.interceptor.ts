import { HttpInterceptorFn } from "@angular/common/http";

export const loadingWithCredentialInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req)
};
