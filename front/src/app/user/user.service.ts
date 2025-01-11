import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  Gearboxes,
  Getvehicals,
  ReadingDevice,
  VehicleModel,
} from './core/Models/ReadOrder';
import { isPlatformBrowser } from '@angular/common';
import { UserSettings } from './core/Models/setting';
import { INotification } from './core/Models/notification';
import { Paging } from './core/Models/UserOrder';
import { userInfo } from '../core/Models/UserInfo';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userUrl = environment.baseEndPoint;
  http = inject(HttpClient);
  private userNameObservable = new BehaviorSubject<userInfo>(new userInfo());
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  userName$ = this.userNameObservable.asObservable();
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  // initalOrder() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     return this.http.get(this.userUrl + 'Orders/initial-order');
  //   }
  //   return null;
  // }
  getUserInfo() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http
        .get<userInfo>(`${this.userUrl}Account/get-user-info`)
        .pipe(
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
    return this.http.get(`${this.userUrl}AccountLogout`).pipe(
      map((m) => {
        this.userNameObservable.next(new userInfo());
        return m;
      })
    );
  }
  getAllOrders(param: any) {
    let parameterss = new HttpParams();

    if (param.search != null) {
      parameterss = parameterss.append('search', param.search);
    }
    if(param.status){

      parameterss = parameterss.append('status', param.status);
    }

    parameterss = parameterss.append('pageNumber', param.pageNumber);
    parameterss = parameterss.append('pageSize', param.pageSize);

    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<Paging>(`${this.userUrl}Orders/get-orders`, {
        params: parameterss,
      });
    }
    return null;
  }
  deleteUser() {
    return this.http.post(this.userUrl + 'Account/delete-user', {});
  }
  getUserSettings() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<UserSettings>(this.userUrl + 'Account/user-setting');
    }
    return null;
  }
  editUserSettings(userSettings: UserSettings) {
    return this.http.put<UserSettings>(
      `${this.userUrl}Account/edit-settings`,
      userSettings
    );
  }

  Vehicles() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<Getvehicals[]>(this.userUrl + 'Orders/vehicals');
    }
    return null;
  }
  VehiclesModel(id: number) {
    return this.http.get<VehicleModel[]>(
      this.userUrl + 'Orders/vehicals-model?id=' + id
    );
  }

  ReadingDevice() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<ReadingDevice[]>(
        this.userUrl + 'Orders/reading-device'
      );
    }
    return null;
  }
  Gearboxes(ReadingDeviceid: number) {
    return this.http.get<Gearboxes[]>(
      this.userUrl + 'Orders/gearboxes?id=' + ReadingDeviceid
    );
  }
  getAllNotifications() {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<INotification[]>(
        this.userUrl + 'Account/get-notification'
      );
    }
    return null;
  }
  readNotification(id: number[]) {
    return this.http.put(this.userUrl + 'Account/read-notification', id);
  }
}
