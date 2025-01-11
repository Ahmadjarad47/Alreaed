import { ReadHomeAbout } from './core/Models/homeAbout';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReadHero } from './core/Models/hero/heroCrud';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ReadHomeProduct } from './core/Models/homeProduct';
import { ReturnUserDTO, UserBlock, UserRole } from './core/Models/User';
import { AddMessageFromAdmin, ReadMessage } from './core/Models/Message';
import { Paging } from './core/Models/OrderModels';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  url = environment.adminURL;
  userUrl = environment.baseEndPoint;
  http = inject(HttpClient);
  private isOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpen.asObservable();
  toggleNavbar(value: boolean) {
    this.isOpen.next(value);
  }
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  getHeroSection(): Observable<ReadHero[]> | null {
    if (isPlatformBrowser(this.platformId)) {
      // Only execute this in the browser
      return this.http.get<ReadHero[]>(this.url + '/Heros/getAll');
    } else {
      console.log('SSR: Skipping API call');
      return null;
    }
  }
  getHerobyId(id: number) {
    return this.http.get<ReadHero>(this.url + '/Heros/get-by-id?id=' + id);
  }
  addHero(data: FormData) {
    return this.http.post(this.url + '/Heros/add', data);
  }
  updateHero(data: FormData) {
    return this.http.put(this.url + '/Heros/update', data);
  }
  deleteHero(id: number) {
    return this.http.delete(this.url + '/Heros/delete?id=' + id);
  }
  // ///////////////////////////////////////////

  addAddhomeAbout(data: FormData) {
    return this.http.post(this.url + '/HomeAbout/add', data);
  }
  deletehomeAbouts(id: number) {
    return this.http.delete(this.url + '/HomeAbout/delete?id=' + id);
  }
  updatehomeAbouts(data: FormData) {
    return this.http.put(this.url + '/HomeAbout/update', data);
  }
  gethomeAbouts() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<ReadHomeAbout[]>(this.url + '/HomeAbout/getAll');
    }
    return null;
  }
  gethomeAboutsById(id: number) {
    return this.http.get<ReadHomeAbout>(
      this.url + '/HomeAbout/get-by-id?id=' + id
    );
  }
  // ///////////////////////////////////////////

  addSubService(data: FormData) {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post(this.url + '/SubServices/add', data);
    }
    return null;
  }
  deleteSubService(id: number) {
    return this.http.delete(this.url + '/SubServices/delete?id=' + id);
  }
  updateSubService(data: FormData) {
    return this.http.put(this.url + '/SubServices/update', data);
  }
  getSubServiceeAbouts() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<ReadHomeAbout[]>(this.url + '/SubServices/getAll');
    }
    return null;
  }
  getSubServiceById(id: number) {
    return this.http.get<ReadHomeAbout>(
      this.url + '/SubServices/get-by-id?id=' + id
    );
  }
  // ///////////////////////////////////////////

  addService(data: FormData) {
    return this.http.post(this.url + '/Service/add', data);
  }
  deleteService(id: number) {
    return this.http.delete(this.url + '/Service/delete?id=' + id);
  }
  updateService(data: FormData) {
    return this.http.put(this.url + '/Service/update', data);
  }
  getServiceeAbouts() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<ReadHomeAbout[]>(this.url + '/Service/getAll');
    }
    return null;
  }
  getServiceById(id: number) {
    return this.http.get<ReadHomeAbout>(
      this.url + '/Service/get-by-id?id=' + id
    );
  }
  // ///////////////////////////////////////////

  addHomeProduct(data: FormData) {
    return this.http.post(this.url + '/homeProduct/add', data);
  }
  deleteHomeProduct(id: number) {
    return this.http.delete(this.url + '/homeProduct/delete?id=' + id);
  }
  updateHomeProduct(data: FormData) {
    return this.http.put(this.url + '/homeProduct/update', data);
  }
  getHomeProduct() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<ReadHomeProduct[]>(this.url + '/homeProduct/getAll');
    }
    return null;
  }
  getHomeProductById(id: number) {
    return this.http.get<ReadHomeProduct>(
      this.url + '/homeProduct/get-by-id?id=' + id
    );
  }
  // ///////////////////////////////////////////
  getAllUsers() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<ReturnUserDTO[]>(
        `${this.url}/UserManagmant/get-users`
      );
    }
    return null;
  }
  blockUser(Userblock: UserBlock) {
    return this.http.get(
      `${this.url}/UserManagmant/block-user?email=${
        Userblock.email
      }&blockAt=${Userblock.blockAt.toString()}`
    );
  }
  changeRole(UserRole: UserRole) {
    return this.http.get(
      `${this.url}/UserManagmant/change-role?email=${
        UserRole.email
      }&role=${UserRole.role.toString()}`
    );
  }
  unblockUser(email: string) {
    return this.http.get(
      `${this.url}/UserManagmant/unblock-user?email=${email}`
    );
  }

  // ///////////////////////////////////////////
  getAllMessages() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<ReadMessage[]>(`${this.url}/Messages/getAll`);
    }
    return null;
  }
  getMessageById(id: number) {
    return this.http.get(`${this.url}/Messages/get-message-by-id?id=${id}`);
  }
  addNewMessageFromAdmin(message: AddMessageFromAdmin) {
    return this.http.post(`${this.url}/Messages/add`, message);
  }
  DeleteMessageFromAdmin(id: number) {
    return this.http.delete(`${this.url}/Messages/delete-by-admin?id=${id}`);
  }
  ReadMessage(userEmail: string) {
    return this.http.put(
      `${this.url}/Messages/admin-read-message?userEmail=${userEmail}`,
      {}
    );
  }
  //----------------------!-----------------------------------------!-----------------------------
  getAllOrders(param: any) {
    let parameterss = new HttpParams();

    if (param.search != null) {
      parameterss = parameterss.append('search', param.search);
    }

    parameterss = parameterss.append('pageNumber', param.pageNumber);
    parameterss = parameterss.append('pageSize', param.pageSize);

    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<Paging>(`${this.url}/Orders/get-all`, {
        params: parameterss,
      });
    }
    return null;
  }
  getInProcessOrders(param: any) {
    let parameterss = new HttpParams();

    if (param.search != null) {
      parameterss = parameterss.append('search', param.search);
    }
    parameterss = parameterss.append('pageNumber', param.pageNumber);
    parameterss = parameterss.append('pageSize', param.pageSize);

    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<Paging>(`${this.url}/Orders/get-all-inprocess`, {
        params: parameterss,
      });
    }
    return null;
  }
  InProcessOrder(id: number) {
    return this.http.put(`${this.url}/Orders/in-process?orderId=${id}`, {});
  }
  AcceptOrderAndSetNewFile(form: FormData) {
    return this.http.put(`${this.url}/Orders/accept-order`, form);
  }
  ChangeStatusToPending(id: number) {
    return this.http.put(`${this.url}/Orders/pending?id=${id}`, {});
  }
  ChangeStatusToReject(id: number, message: string) {
    const f = new FormData();
    f.append('message', message);
    return this.http.put(`${this.url}/Orders/rejected-order?id=${id}`,f);
  }
}
