import { Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../lib/auth/auth.service';
import { IAlert } from '../shared/commonmodule/alert';
import { PoolShell, PoolShellRepository } from '../lib/pool/shell/repository';
import { Role } from '../lib/role';
import { GlobalEventsManager } from '../shared/commonmodule/eventmanager';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-home",
  standalone: true,
  imports: [FontAwesomeModule, NgbAlertModule,RouterLink],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public processingMyShells: WritableSignal<boolean> = signal(true);
  public canCreateAndJoin = false;
  public canAssemble = false;
  public myShells: PoolShell[] = [];
  public alert: IAlert | undefined;
  public faSpinner = faSpinner;
  public faPlusCircle = faPlusCircle;

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
    this.route.queryParams.subscribe((params) => {
      if (params.type !== undefined && params.message !== undefined) {
        this.alert = { type: params["type"], message: params["message"] };
      }
    });
    this.ngOnInitMyShells();
  }

  ngOnInitMyShells() {
    // if (!this.authService.isLoggedIn()) {
    //   this.processingWithRole = false;
    //   return;
    // }

    this.poolShellRepos.canCreateAndJoinPool().subscribe({
      next: (poolActions: number) => {
        this.canCreateAndJoin =
          (poolActions & PoolActions.CreateAndJoin) ===
          PoolActions.CreateAndJoin;
        this.canAssemble =
          (poolActions & PoolActions.Assemble) === PoolActions.Assemble;
        if (!this.authService.isLoggedIn()) {
          this.processingMyShells.set(false);
          return;
        }

        const filter = { roles: Role.COMPETITOR };
        this.poolShellRepos
          .getObjects(this.authService.getUser(), filter)
          .subscribe({
            next: (shells: PoolShell[]) => {
              this.myShells = this.sortShellsByDateDesc(
                shells.filter((shell) => shell.seasonName > "2021" && shell.name !== 'WorldCup')
              );
            },
            error: (e) => {
              this.setAlert("danger", e);
              this.processingMyShells.set(false);
            },
            complete: () => {
              this.processingMyShells.set(false);
            },
          });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processingMyShells.set(false);
      },
    });
  }

  protected sortShellsByDateDesc(shells: PoolShell[]): PoolShell[] {
    shells.sort((ts1, ts2) => {
      return ts1.seasonName < ts2.seasonName ? 1 : -1;
    });
    return shells;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type: type, message: message };
    console.log(this.alert);
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
    const year = new Date().getFullYear();
    const shellYear = shell.seasonName.substring(0, 4);
    if (year == +shellYear) {
      if (this.canAssemble) {
        this.router.navigate(["/pool/formation/assemble", shell.poolId]);
        return;
      } else if (this.canCreateAndJoin) {
        this.router.navigate(["/pool/users", shell.poolId]);
        return;
      }
    } // else {
    this.router.navigate(["/pool", shell.poolId]);
    // }
  }
}

export enum PoolActions {
  CreateAndJoin = 1, Assemble
}