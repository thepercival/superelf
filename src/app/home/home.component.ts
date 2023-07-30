import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../lib/auth/auth.service';
import { IAlert } from '../shared/commonmodule/alert';
import { PoolShell, PoolShellFilter, PoolShellRepository } from '../lib/pool/shell/repository';
import { Role } from '../lib/role';
import { PoolRepository } from '../lib/pool/repository';
import { timeout } from 'rxjs/operators';
import { GlobalEventsManager } from '../shared/commonmodule/eventmanager';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public processingMyShells = true;
  public canCreate = false;
  myShells: PoolShell[] = [];

  // static readonly FUTURE: number = 1;
  // static readonly PAST: number = 2;

  // shellsWithRoleFromX: PoolShell[] = [];
  // shellsWithRoleX = 5;
  // // linethroughDate: Date;
  // showingAllWithRole = false;
  // publicShells: PoolShell[] = [];
  // showingFuture = false;
  alert: IAlert | undefined;
  // processingWithRole = true;
  // publicProcessing = true;
  // private nrOfSeasonsBack: number = 3;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private poolShellRepos: PoolShellRepository,
    protected globalEventsManager: GlobalEventsManager
  ) {
    this.globalEventsManager.navHeaderInfo.emit(undefined);
    globalEventsManager.showFooter.emit(true);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.type !== undefined && params.message !== undefined) {
        this.alert = { type: params['type'], message: params['message'] };
      }
    });
    this.ngOnInitMyShells();
  }

  ngOnInitMyShells() {
    // if (!this.authService.isLoggedIn()) {
    //   this.processingWithRole = false;
    //   return;
    // }

    this.poolShellRepos.canCreateAndJoinPool()
      .subscribe(
        {
          next: (canCreate: boolean) => {
            this.canCreate = canCreate;
            if (!this.authService.isLoggedIn()) {
              this.processingMyShells = false;
              return;
            }

            const filter = { roles: Role.COMPETITOR + Role.ADMIN };
            this.poolShellRepos.getObjects(filter)
              .subscribe({
                next: (shells: PoolShell[]) => {
                  this.myShells = this.sortShellsByDateDesc(shells);
                },
                error: (e) => {
                  this.setAlert('danger', e); this.processingMyShells = false;
                },
                complete: () => this.processingMyShells = false
              });
          },
          error: (e) => {
            this.setAlert('danger', e); this.processingMyShells = false;
          }
        }


      );
  }

  protected sortShellsByDateDesc(shells: PoolShell[]): PoolShell[] {
    shells.sort((ts1, ts2) => {
      return (ts1.seasonName < ts2.seasonName ? 1 : -1);
    });
    return shells;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  // isLoggedIn() {
  //   return this.authService.isLoggedIn();
  // }

  linkToNew() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pool/new']);
    } else {
      this.router.navigate(['/pool/prenew']);
    }
  }

  linkToPool(shell: PoolShell) {
    if( this.canCreate ) {
      this.router.navigate(['/pool/users', shell.poolId]);
    } else {
      this.router.navigate(['/pool', shell.poolId]);
    }
  }

}
