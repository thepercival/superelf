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

  shellsWithRoleTillX: PoolShell[] = [];
  shellsWithRoleFromX: PoolShell[] = [];
  shellsWithRoleX = 5;
  // linethroughDate: Date;
  showingAllWithRole = false;
  publicShells: PoolShell[] = [];
  showingFuture = false;
  alert: IAlert | undefined;
  processingWithRole = true;
  publicProcessing = true;
  public firstTimeVisit: boolean | undefined;
  private nrOfSeasonsBack: number = 3;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private poolShellRepos: PoolShellRepository
  ) {
    this.checkFirstTimeVisit();
    // this.linethroughDate = new Date();
    // this.linethroughDate.setHours(this.linethroughDate.getHours() + this.defaultHourRange.start);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.type !== undefined && params.message !== undefined) {
        this.alert = { type: params['type'], message: params['message'] };
      }
    });
  }

  ngAfterViewInit() {
    this.setShellsWithRole();
  }

  setShellsWithRole() {
    if (!this.authService.isLoggedIn()) {
      this.processingWithRole = false;
      return;
    }

    const filter = { roles: Role.COMPETITOR + Role.ADMIN };
    this.poolShellRepos.getObjects(filter)
      .subscribe(
          /* happy path */ myShells => {
          this.sortShellsByDateDesc(myShells);
          while (myShells.length > 0) {
            if (this.shellsWithRoleTillX.length < this.shellsWithRoleX) {
              const myShell = myShells.shift();
              myShell ? this.shellsWithRoleTillX.push(myShell) : undefined;
            } else {
              const myShell = myShells.shift();
              myShell ? this.shellsWithRoleFromX.push(myShell) : undefined;
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
    this.poolShellRepos.getObjects(searchFilter)
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
      this.router.navigate(['/pool/new']);
    } else {
      this.router.navigate(['/pool/prenew']);
    }
  }

  linkToPool(shell: PoolShell) {
    this.processingWithRole = true;
    this.router.navigate(['/pool', shell.poolId]);
  }

  private extendHourRange(pastFuture: number, hoursToAdd: number): PoolShellFilter {
    const startDate = new Date(), endDate = new Date();
    return this.getSearchFilter(startDate, endDate, undefined);
  }

  private getSearchFilter(startDate: Date, endDate: Date, name: string | undefined): PoolShellFilter {
    return { startDate: startDate, endDate: endDate, name: name };
  }
}
