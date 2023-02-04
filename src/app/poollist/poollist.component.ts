import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../lib/auth/auth.service';
import { IAlert } from '../shared/commonmodule/alert';
import { PoolShell,  PoolShellRepository } from '../lib/pool/shell/repository';
import { GlobalEventsManager } from '../shared/commonmodule/eventmanager';
import { Season } from 'ngx-sport';
import { SeasonRepository } from '../lib/season/repository';

@Component({
  selector: 'app-pools',
  templateUrl: './poollist.component.html',
  styleUrls: ['./poollist.component.scss']
})
export class PoolListComponent implements OnInit {
  public processing = true;
  public searching = false;
  // linethroughDate: Date;
  public selectableSeasons: Season[]|undefined;
  public selectedSeason: Season|undefined;
  public poolShells: PoolShell[] = [];
  public alert: IAlert | undefined;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private poolShellRepos: PoolShellRepository,
    private seasonRepos: SeasonRepository,
    protected globalEventsManager: GlobalEventsManager
  ) {
    this.globalEventsManager.navHeaderInfo.emit(undefined);
  }

  ngOnInit() {
    
    // set season

    this.seasonRepos.getObjects()
      .subscribe(
        {
          next: (seasons: Season[]) => {
            
            this.selectableSeasons = seasons;
            this.selectedSeason = seasons[0];
            this.updatePools();
            this.processing = false;
          },
          error: (e) => {
            this.setAlert('danger', e); this.processing = false;
          }
        }


      );
  }

  updatePools() {
    if( this.selectedSeason === undefined) {
      return;
  }
    this.searching = true;
    // console.log(this.selectedSeason);

    const filter = { seasonId: this.selectedSeason.getId() };
    this.poolShellRepos.getObjects(filter)
      .subscribe({
        next: (shells: PoolShell[]) => {
          this.poolShells = shells;
        },
        error: (e) => {
          this.setAlert('danger', e); this.searching = false;
        },
        complete: () => this.searching = false
      });

  }


  // 
  //   this.poolShellRepos.getObjects(filter)
  // .subscribe(
  //         /* happy path */ myShells => {
  //     this.sortShellsByDateDesc(myShells);
  //     while (myShells.length > 0) {
  //       if (this.shellsWithRoleTillX.length < this.shellsWithRoleX) {
  //         const myShell = myShells.shift();
  //         myShell ? this.shellsWithRoleTillX.push(myShell) : undefined;
  //       } else {
  //         const myShell = myShells.shift();
  //         myShell ? this.shellsWithRoleFromX.push(myShell) : undefined;
  //       }
  //     }
  //     this.processingWithRole = false;
  //     this.authService.extendToken();
  //   },
  //         /* error path */ e => { this.setAlert('danger', e); this.processingWithRole = false; },
  //         /* onComplete */() => { this.processingWithRole = false; }
  // );
  // }

  // addToPublicShells(pastFuture: number, hoursToAdd: number) {
  //   this.publicProcessing = true;
  //   const searchFilter = this.extendHourRange(pastFuture, hoursToAdd);
  //   this.poolShellRepos.getObjects(searchFilter)
  //     .subscribe(
  //           /* happy path */(shellsRes: PoolShell[]) => {
  //         this.sortShellsByDateAsc(shellsRes);
  //         if (pastFuture === HomeComponent.PAST) {
  //           this.publicShells = shellsRes.concat(this.publicShells);
  //         } else if (pastFuture === HomeComponent.FUTURE) {
  //           this.publicShells = this.publicShells.concat(shellsRes);
  //         }
  //         // this.showingFuture = (futureDate === undefined);
  //         this.publicProcessing = false;
  //       },
  //         /* error path */ e => { this.setAlert('danger', e); this.publicProcessing = false; }
  //     );
  // }

  //   protected sortShellsByDateAsc(shells: PoolShell[]) {
  //   shells.sort((ts1, ts2) => {
  //     return (ts1.seasonName > ts2.seasonName ? 1 : -1);
  //   });
  // }

  //   protected sortShellsByDateDesc(shells: PoolShell[]) {
  //   shells.sort((ts1, ts2) => {
  //     return (ts1.seasonName < ts2.seasonName ? 1 : -1);
  //   });
  // }

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
    this.router.navigate(['/pool', shell.poolId]);
  }

  //   private extendHourRange(pastFuture: number, hoursToAdd: number): PoolShellFilter {
  //   const startDate = new Date(), endDate = new Date();
  //   return this.getSearchFilter(startDate, endDate, undefined);
  // }

  //   private getSearchFilter(startDate: Date, endDate: Date, name: string | undefined): PoolShellFilter {
  //   return { startDate: startDate, endDate: endDate, name: name };
  // }
}