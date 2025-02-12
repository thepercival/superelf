import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../lib/auth/auth.service';
import { DateFormatter } from '../../../lib/dateFormatter';
import { User } from '../../../lib/user';
import { GlobalEventsManager } from '../../commonmodule/eventmanager';
import { MyNavigation } from '../../commonmodule/navigation';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  faSignInAlt = faSignInAlt
  faUserCircle = faUserCircle
  navbarCollapsed = true;
  user: User | undefined;
  public nameInfo: NavHeaderInfo | undefined;

  constructor(
    public authService: AuthService,
    private dateFormatter: DateFormatter,
    private globalEventsManager: GlobalEventsManager,
    public navigation: MyNavigation,
    private router: Router
  ) {
    this.globalEventsManager.navHeaderInfo.subscribe(
      (headerInfo: NavHeaderInfo | undefined) => {
        this.nameInfo = headerInfo;
      }
    );
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    // console.log('navcomponent::ngOnInit this.user', this.user);
  }

  getSeasonStart(startDate: Date): string {
    return this.convertDateToYear(startDate);
  }

  getSeasonEnd(startDate: Date): string {
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1);
    return this.convertDateToYear(endDate);
  }

  private convertDateToYear(dDate: Date): string {
    return this.dateFormatter.toString(dDate, { year: "2-digit" });
  }

  navigateToPoolHome(id: number): void {
    this.router.navigate(["/pool", id]);
  }
}

export interface NavHeaderInfo {
  id: number;
  name: string;
  start: Date;
  showBackBtn?: boolean;
}