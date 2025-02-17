
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, FootballLine } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbAlertModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
import { S11Player } from '../../lib/player';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11FormationPlace } from '../../lib/formation/place';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { AuthService } from '../../lib/auth/auth.service';
import { GameRound } from '../../lib/gameRound';
import { Observable, of } from 'rxjs';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { ViewPeriod } from '../../lib/period/view';
import { StatisticsRepository } from '../../lib/statistics/repository';
import { S11Formation } from '../../lib/formation';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { FormationLineViewComponent } from '../formation/line/view.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { NgIf } from '@angular/common';
import { faRightLeft, faUsers, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-pool-user",
  standalone: true,
  imports: [
    NgIf,
    NgbAlertModule,
    FontAwesomeModule,
    GameRoundScrollerComponent,
    FormationLineViewComponent,
    PoolNavBarComponent,
  ],
  templateUrl: "./pooluser.component.html",
  styleUrls: ["./pooluser.component.scss"],
})
export class PoolUserComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  nameService = new NameService();
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public viewPeriod!: ViewPeriod;
  public formation: S11Formation | undefined;
  public gameRounds: (GameRound | undefined)[] = [];
  public currentGameRound: GameRound | undefined;
  public gameRoundCacheMap = new Map<number, true>();
  public statisticsGetter = new StatisticsGetter();

  public totalPoints: number = 0;
  public totalGameRoundPoints: number = 0;
  public processingFormation: WritableSignal<boolean> = signal(true);
  public processingStatistics: WritableSignal<boolean> = signal(false);

  public faRightLeft = faRightLeft;
  public faUsers = faUsers;
  public faSpinner = faSpinner;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected playerRepository: PlayerRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    protected statisticsRepository: StatisticsRepository,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository,
    private gameRoundRepository: GameRoundRepository,
    fb: UntypedFormBuilder,
    protected authService: AuthService,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);

        const currentViewPeriod = this.getCurrentViewPeriod(pool);
        if (currentViewPeriod === undefined) {
          return;
        }
        this.viewPeriod = currentViewPeriod;

        this.route.params.subscribe((params) => {
          this.poolUserRepository
            .getObject(pool, +params.poolUserId)
            .subscribe({
              next: (poolUser: PoolUser) => {
                this.poolUser = poolUser;
                const editPeriod = this.getMostRecentEndedEditPeriod(pool);
                if (editPeriod !== undefined) {
                  this.updateViewPeriod(
                    poolUser,
                    editPeriod.getViewPeriod(),
                    +params.gameRound
                  );
                }
              },
              error: (e: string) => {
                this.setAlert("danger", e);
                this.processing.set(false);
              },
              complete: () => this.processing.set(false),
            });
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  get GoalKeeper(): FootballLine {
    return FootballLine.GoalKeeper;
  }

  public updateViewPeriod(
    poolUser: PoolUser,
    viewPeriod: ViewPeriod,
    gameRoundNr: number | undefined
  ): void {
    this.viewPeriod = viewPeriod;

    this.processingFormation.set(true);
    this.formationRepository.getObject(poolUser, viewPeriod).subscribe({
      next: (formation: S11Formation) => {
        this.formation = formation;
        this.totalPoints = this.formation.getTotalPoints(undefined);

        this.initGameRounds(poolUser.getPool(), this.formation, gameRoundNr);
        this.processingFormation.set(false);
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  private getCurrentGameRound(
    pool: Pool,
    gameRoundParam: number | undefined
  ): Observable<GameRound | undefined | CurrentGameRoundNumbers> {
    if (gameRoundParam !== undefined && gameRoundParam > 0) {
      return of(this.viewPeriod.getGameRound(gameRoundParam));
    }
    return this.gameRoundRepository.getCurrentNumbers(
      pool.getCompetitionConfig(),
      this.viewPeriod
    );
  }

  private initGameRounds(
    pool: Pool,
    formation: S11Formation,
    gameRoundParam: number | undefined
  ): void {
    this.getCurrentGameRound(pool, gameRoundParam).subscribe({
      next: (object: GameRound | undefined | CurrentGameRoundNumbers) => {
        let currentGameRound;
        if (object instanceof GameRound) {
          currentGameRound = object;
        } else if (object !== undefined) {
          if (object.hasOwnProperty("lastFinishedOrInPorgress")) {
            const lastFinishedOrInPorgress = object.lastFinishedOrInPorgress;
            if (typeof lastFinishedOrInPorgress === "number") {
              currentGameRound = this.viewPeriod.getGameRound(
                lastFinishedOrInPorgress
              );
            }
          } else if (object.hasOwnProperty("firstCreatedOrInProgress")) {
            const firstCreatedOrInProgress = object.firstCreatedOrInProgress;
            if (typeof firstCreatedOrInProgress === "number") {
              currentGameRound = this.viewPeriod.getGameRound(
                firstCreatedOrInProgress
              );
            }
          }
        }
        // console.log(object);
        const gameRounds: (GameRound | undefined)[] = this.viewPeriod
          .getGameRounds()
          .slice();
        this.gameRounds = gameRounds;
        if (currentGameRound !== undefined) {
          const idx = this.gameRounds.indexOf(this.currentGameRound);
          if (idx >= 0) {
            this.gameRounds = this.gameRounds
              .splice(idx)
              .concat([], this.gameRounds);
          }
          this.setGameRoundAndGetStatistics(formation, currentGameRound);
        }
      },
      error: (e: string) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
      complete: () => this.processing.set(false),
    });
  }

  // getGameRounds(): (GameRound | undefined)[] {
  //   const gameRounds = this.poolUser?.getPool().getAssembleViewPeriod().getGameRounds();
  //   return gameRounds !== undefined ? gameRounds : [];
  // }

  setGameRoundAndGetStatistics(
    formation: S11Formation,
    gameRound: GameRound | undefined
  ): void {
    if (gameRound === undefined) {
      return;
    }
    if (this.gameRoundCacheMap.has(gameRound.getNumber())) {
      this.currentGameRound = gameRound;
      this.totalGameRoundPoints =
        this.statisticsGetter.getFormationGameRoundPoints(
          formation,
          gameRound,
          undefined
        );
      return;
    }

    this.processingStatistics.set(true);
    this.statisticsRepository
      .getGameRoundObjects(formation, gameRound, this.statisticsGetter)
      .subscribe({
        next: () => {
          this.currentGameRound = gameRound;
          this.totalGameRoundPoints =
            this.statisticsGetter.getFormationGameRoundPoints(
              formation,
              gameRound,
              undefined
            );
          this.gameRoundCacheMap.set(gameRound.getNumber(), true);
          this.processingStatistics.set(false);
        },
        error: (e) => {
          this.setAlert("danger", e);
          this.processing.set(false);
        },
      });
  }

  getPoolUserName(): string {
    const user = this.poolUser.getUser();
    return this.authService.getUser()?.getId() === user.getId()
      ? "mijn team"
      : "" + user.getName();
  }

  getFormationName(): string {
    return this.formation?.getName() ?? "kies formatie";
  }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToPlayer(pool: Pool, s11Player: S11Player): void {
    const gameRoundNumber = this.currentGameRound
      ? this.currentGameRound.getNumber()
      : 0;
    this.router.navigate(
      ["/pool/player/", pool.getId(), s11Player.getId(), gameRoundNumber] /*, {
      state: { s11Player, "pool": pool, currentGameRound: undefined }
    }*/
    );
  }

  inAfterTransfer(pool: Pool): boolean {
    return (
      pool.getTransferPeriod().getEndDateTime().getTime() < new Date().getTime()
    );
  }
}
