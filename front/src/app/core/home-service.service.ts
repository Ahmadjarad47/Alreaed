import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ReadHero } from '../admin/core/Models/hero/heroCrud';
import { ReadHomeAbout } from '../admin/core/Models/homeAbout';
import { ReadSubService } from '../admin/core/Models/SubService';
import { IService } from '../admin/core/Models/service';

@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {
  baseUrl = environment.baseEndPoint;
  http = inject(HttpClient);
  getHero() {
   return this.http.get<ReadHero>(this.baseUrl + 'Homes/get-hero-section');
  }
  gethomeAbouts() {
   return this.http.get<ReadHomeAbout>(this.baseUrl + 'Homes/get-home-about-section');
  }
  getSubService() {
    return this.http.get<ReadSubService[]>(this.baseUrl + 'Homes/get-home-sub-service-section');
   }
  getService() {
    return this.http.get<IService>(this.baseUrl + 'Homes/get-home-service-section');
   }
}
