import { Component, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../src/app/lib/auth/auth.service';
import { IAlert } from '../../src/app/shared/commonmodule/alert';
import { PoolShell,  PoolShellRepository } from '../../src/app/lib/pool/shell/repository';
import { GlobalEventsManager } from '../../src/app/shared/commonmodule/eventmanager';
import { Season } from 'ngx-sport';
import { SeasonRepository } from '../../src/app/lib/season/repository';
import { FormControl, FormGroup } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../src/app/lib/user';

@Component({
  selector: "app-pools",
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: "./poollist.component.html",
  styleUrls: ["./poollist.component.scss"],
})
export class PoolListComponent implements OnInit {
  public user = input.required<User>();
  public processing = true;
  public searching = false;
  // linethroughDate: Date;
  public selectableSeasons: Season[] | undefined;
  public poolShells: PoolShell[] = [];
  public alert: IAlert | undefined;
  public typedForm: FormGroup<{
    season: FormControl<Season | null>;
  }>;
  public faSpinnter = faSpinner;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private poolShellRepos: PoolShellRepository,
    private seasonRepos: SeasonRepository,
    protected globalEventsManager: GlobalEventsManager
  ) {
    this.globalEventsManager.navHeaderInfo.emit(undefined);
    this.typedForm = new FormGroup({
      season: new FormControl<Season | null>(null, {
        nonNullable: false,
      }),
    });
  }

  ngOnInit() {
    // set season

    this.seasonRepos.getObjects().subscribe({
      next: (seasons: Season[]) => {
        this.selectableSeasons = seasons
          .filter((season) => season.getName() > "2021")
          .sort((seasonA: Season, seasonB: Season): number => {
            return (
              seasonB.getStartDateTime().getTime() -
              seasonA.getStartDateTime().getTime()
            );
          })
          .slice();
        this.typedForm.controls.season.setValue(this.selectableSeasons[0]);
        this.updatePools();

        this.processing = false;
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing = false;
      },
    });
  }

  updatePools() {
    // console.log(this.typedForm.controls.season.value);
    const season = this.typedForm.controls.season.value;
    if (season === null) {
      return;
    }
    this.searching = true;
    // console.log(this.selectedSeason);

    const filter = { seasonId: season.getId() };
    this.poolShellRepos.getObjects(this.user(), filter).subscribe({
      next: (shells: PoolShell[]) => {
        this.poolShells = shells.filter((shell) => shell.seasonName > "2021");
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.searching = false;
      },
      complete: () => (this.searching = false),
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
    this.alert = { type: type, message: message };
  }

  // isLoggedIn() {
  //   return this.authService.isLoggedIn();
  // }

  linkToNew() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/pool/new"]);
    } else {
      this.router.navigate(["/pool/prenew"]);
    }
  }

  linkToPool(shell: PoolShell) {
    this.router.navigate(["/pool", shell.poolId]);
  }

  //   private extendHourRange(pastFuture: number, hoursToAdd: number): PoolShellFilter {
  //   const startDate = new Date(), endDate = new Date();
  //   return this.getSearchFilter(startDate, endDate, undefined);
  // }

  //   private getSearchFilter(startDate: Date, endDate: Date, name: string | undefined): PoolShellFilter {
  //   return { startDate: startDate, endDate: endDate, name: name };
  // }
}
