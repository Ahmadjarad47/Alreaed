import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
http=inject(HttpClient)
url=environment.baseAccountURL
Register(form:FormGroup){
  return this.http.post(`${this.url}Register`,form)
}
Login(form:FormGroup){
  return this.http.post(`${this.url}Login`,form)
}
ResetPassword(form:FormGroup){
  return this.http.post(`${this.url}Reset-Password`,form)
}
Active(form:FormGroup){
  return this.http.post(`${this.url}Active`,form)
}
  constructor() { }
}
