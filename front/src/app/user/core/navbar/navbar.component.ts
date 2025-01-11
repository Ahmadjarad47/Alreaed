import { AfterViewInit, Component, inject } from '@angular/core';
import { UserService } from '../../user.service';
import { userInfo } from '../../../core/Models/UserInfo';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit {
  userService = inject(UserService);
  userInfo = new userInfo();
  ngAfterViewInit(): void {
    this.userService.getUserInfo().subscribe();
    this.userService.userName$.subscribe((m) => {
      this.userInfo = m;
    });
  }
  Logout(){
    this.userService.logout().subscribe();
    
  }
}
