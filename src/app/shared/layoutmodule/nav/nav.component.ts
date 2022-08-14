import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../../lib/auth/auth.service';
import { DateFormatter } from '../../../lib/dateFormatter';
import { User } from '../../../lib/user';
import { GlobalEventsManager } from '../../commonmodule/eventmanager';
import { MyNavigation } from '../../commonmodule/navigation';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  navbarCollapsed = true;
  user: User | undefined
  public nameInfo: NavHeaderInfo | undefined;

  constructor(
    public authService: AuthService,
    private dateFormatter: DateFormatter,
    private globalEventsManager: GlobalEventsManager,
    public navigation: MyNavigation
  ) {
    this.globalEventsManager.navHeaderInfo.subscribe((headerInfo: NavHeaderInfo | undefined) => {
      this.nameInfo = headerInfo;
    });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    // console.log('navcomponent::ngOnInit this.user', this.user);
  }

  getSeasonStart(startDate: Date): string {
    return this.convertDateToYear(startDate);
  }

  getSeasonEnd(startDate: Date): string {
    const endDate = (new Date(startDate));
    endDate.setFullYear(startDate.getFullYear() + 1);
    return this.convertDateToYear(endDate);
  }

  private convertDateToYear(dDate: Date): string {
    return this.dateFormatter.toString(dDate, { year: '2-digit' });
  }
}

export interface NavHeaderInfo {
  name: string;
  start: Date;
  showBackBtn?: boolean;
}