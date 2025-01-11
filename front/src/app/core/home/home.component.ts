import {
  Component,
  AfterViewInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { ReadHero } from '../../admin/core/Models/hero/heroCrud';
import { HomeServiceService } from '../home-service.service';
import { environment } from '../../../environments/environment.development';
import { ReadHomeAbout } from '../../admin/core/Models/homeAbout';
import { ReadSubService } from '../../admin/core/Models/SubService';
import { IService } from '../../admin/core/Models/service';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  hero = new ReadHero();
  homeAbout = new ReadHomeAbout();
  subService: ReadSubService[] = [];
  service = new IService();
  core = inject(CoreService);
  base = environment.base;
  lan: string;
  _serivce = inject(HomeServiceService);

  // Inject ChangeDetectorRef
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.core.lang$.subscribe((val) => {
      this.lan = val;
      // Trigger change detection if needed
      this.cdr.detectChanges();
    });

    this._serivce.getHero().subscribe((res) => {
      this.hero = res;
      console.log(this.hero);
      // Trigger change detection
      this.cdr.detectChanges();
    });

    this._serivce.gethomeAbouts().subscribe((res) => {
      this.homeAbout = res;
      this.cdr.detectChanges();
    });

    this._serivce.getService().subscribe((res) => {
      this.service = res;
      this.cdr.detectChanges();
    });

    this._serivce.getSubService().subscribe((res) => {
      this.subService = res;
      this.cdr.detectChanges();
    });
  }
}
