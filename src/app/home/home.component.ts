import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../lib/auth/auth.service';
import { IAlert } from '../shared/commonmodule/alert';
import { PoolShell, PoolShellFilter, PoolShellRepository } from '../lib/pool/shell/repository';
import { Role } from '../lib/role';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  static readonly FUTURE: number = 1;
  static readonly PAST: number = 2;

  @ViewChild('inputsearchname') private searchElementRef: ElementRef;

  shellsWithRoleTillX: PoolShell[];
  shellsWithRoleFromX: PoolShell[];
  shellsWithRoleX = 5;
  linethroughDate: Date;
  showingAllWithRole = false;
  publicShells: PoolShell[];
  showingFuture = false;
  alert: IAlert;
  processingWithRole = true;
  publicProcessing = true;
  public firstTimeVisit;
  private defaultHourRange: HourRange = {
    start: -4, end: 168
  };
  private hourRange: HourRange;
  searchFilterActive = false;
  searchFilterName: string;
  hasSearched = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private PoolShellRepos: PoolShellRepository
  ) {
    this.checkFirstTimeVisit();
    this.linethroughDate = new Date();
    this.linethroughDate.setHours(this.linethroughDate.getHours() + this.defaultHourRange.start);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.type !== undefined && params.message !== undefined) {
        this.alert = { type: params['type'], message: params['message'] };
      }
    });
  }

  ngAfterViewInit() {
    this.disableSearchFilter();
    this.setShellsWithRole();
  }

  onSearchChanges(): void {
    this.changeSearchFilterName(this.searchElementRef.nativeElement.value);
  }

  setShellsWithRole() {
    this.shellsWithRoleTillX = [];
    this.shellsWithRoleFromX = [];

    if (!this.authService.isLoggedIn()) {
      this.processingWithRole = false;
      return;
    }

    const filter = { roles: Role.COMPETITOR + Role.ADMIN };
    this.PoolShellRepos.getObjects(filter)
      .subscribe(
          /* happy path */ myShells => {
          this.sortShellsByDateDesc(myShells);
          while (myShells.length > 0) {
            if (this.shellsWithRoleTillX.length < this.shellsWithRoleX) {
              this.shellsWithRoleTillX.push(myShells.shift());
            } else {
              this.shellsWithRoleFromX.push(myShells.shift());
            }
          }
          this.processingWithRole = false;
          this.authService.extendToken();
        },
          /* error path */ e => { this.setAlert('danger', e); this.processingWithRole = false; },
          /* onComplete */() => { this.processingWithRole = false; }
      );
  }

  addToPublicShells(pastFuture: number, hoursToAdd: number) {
    this.publicProcessing = true;
    const searchFilter = this.extendHourRange(pastFuture, hoursToAdd);
    this.PoolShellRepos.getObjects(searchFilter)
      .subscribe(
          /* happy path */(shellsRes: PoolShell[]) => {
          this.sortShellsByDateAsc(shellsRes);
          if (pastFuture === HomeComponent.PAST) {
            this.publicShells = shellsRes.concat(this.publicShells);
          } else if (pastFuture === HomeComponent.FUTURE) {
            this.publicShells = this.publicShells.concat(shellsRes);
          }
          // this.showingFuture = (futureDate === undefined);
          this.publicProcessing = false;
        },
        /* error path */ e => { this.setAlert('danger', e); this.publicProcessing = false; }
      );
  }

  protected sortShellsByDateAsc(shells: PoolShell[]) {
    shells.sort((ts1, ts2) => {
      return (ts1.seasonName > ts2.seasonName ? 1 : -1);
    });
  }

  protected sortShellsByDateDesc(shells: PoolShell[]) {
    shells.sort((ts1, ts2) => {
      return (ts1.seasonName < ts2.seasonName ? 1 : -1);
    });
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  checkFirstTimeVisit() {
    if (localStorage.getItem('firsttimevisit') === null) {
      this.firstTimeVisit = true;
      localStorage.setItem('firsttimevisit', JSON.stringify(false));
    } else {
      this.firstTimeVisit = false;
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  linkToNew() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pooladmin/new']);
    } else {
      this.router.navigate(['/pool/prenew']);
    }
  }

  linkToView(shell: PoolShell) {
    this.publicProcessing = true;
    this.router.navigate(['/public', shell.poolId]);
  }

  linkToPool(shell: PoolShell) {
    this.processingWithRole = true;
    const module = shell.roles > 0 ? '/admin' : '/public';
    this.router.navigate([module, shell.poolId]);
  }

  enableSearchFilter() {
    this.searchFilterActive = true;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.searchElementRef.nativeElement.scrollIntoView(true);
      this.searchElementRef.nativeElement.focus();
    }, 0);
    this.publicShells = [];
  }


  disableSearchFilter() {
    this.searchFilterActive = false;
    this.publicShells = [];
    this.hourRange = { start: this.defaultHourRange.start, end: this.defaultHourRange.start };
    // this.searchForm.controls.filterName.setValue(undefined);
    this.addToPublicShells(HomeComponent.FUTURE, this.defaultHourRange.end - this.defaultHourRange.start);
  }

  expandPastDays() {
    const pastHoursToAdd = this.hourRange.start === this.defaultHourRange.start
      ? this.defaultHourRange.start + this.defaultHourRange.end : -this.hourRange.start;
    this.addToPublicShells(HomeComponent.PAST, pastHoursToAdd);
  }

  private extendHourRange(pastFuture: number, hoursToAdd: number): PoolShellFilter {
    const startDate = new Date(), endDate = new Date();
    if (pastFuture === HomeComponent.PAST) {
      endDate.setHours(endDate.getHours() + this.hourRange.start);
      this.hourRange.start -= hoursToAdd;
      startDate.setHours(startDate.getHours() + this.hourRange.start);
    } else if (pastFuture === HomeComponent.FUTURE) {
      startDate.setHours(startDate.getHours() + this.hourRange.end);
      this.hourRange.end += hoursToAdd;
      endDate.setHours(endDate.getHours() + this.hourRange.end);
    }
    return this.getSearchFilter(startDate, endDate, undefined);
  }

  private getSearchFilter(startDate: Date, endDate: Date, name: string): PoolShellFilter {
    return { startDate: startDate, endDate: endDate, name: name };
  }

  changeSearchFilterName(searchFilterName: string) {
    if (searchFilterName === undefined || searchFilterName.length < 2) {
      return;
    }
    this.publicProcessing = true;
    const searchFilter = this.getSearchFilter(undefined, undefined, searchFilterName);
    this.PoolShellRepos.getObjects(searchFilter)
      .subscribe(
        /* happy path */(shellsRes: PoolShell[]) => {
          this.publicShells = shellsRes;
          this.publicProcessing = false;
        },
      /* error path */ e => { this.setAlert('danger', e); this.publicProcessing = false; }
      );
  }
}

interface HourRange {
  start: number;
  end: number;
}
