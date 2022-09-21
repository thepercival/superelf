
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, PersonMap, TeamMap, FootballLine, FormationLine } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
import { S11Player, StatisticsMap } from '../../lib/player';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11FormationPlace } from '../../lib/formation/place';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { AuthService } from '../../lib/auth/auth.service';
import { GameRound } from '../../lib/gameRound';
import { forkJoin, Observable, of } from 'rxjs';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { ViewPeriod } from '../../lib/period/view';
import { StatisticsRepository } from '../../lib/statistics/repository';
import { S11FormationLine } from '../../lib/formation/line';

@Component({
  selector: 'app-pool-user',
  templateUrl: './pooluser.component.html',
  styleUrls: ['./pooluser.component.scss']
})
export class PoolUserComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  nameService = new NameService();
  teamPersonMap = new PersonMap();
  selectedPlace: S11FormationPlace | undefined;
  selectedSearchLine: FootballLine | undefined;
  selectedTeamMap: TeamMap = new TeamMap();
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public currentGameRound: GameRound | undefined;
  public gameRounds: (GameRound | undefined)[] = [];
  public viewPeriod!: ViewPeriod;
  public processingStatistics: boolean = false;

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
    super.parentNgOnInit()
      .subscribe({
        next: (pool: Pool) => {
          this.setPool(pool);

          const competitionConfig = this.pool.getCompetitionConfig();
          const currentViewPeriod = competitionConfig.getViewPeriodByDate(new Date());
          if (currentViewPeriod === undefined) {
            return;
          }
          this.viewPeriod = currentViewPeriod;

          this.route.params.subscribe(params => {


            this.poolUserRepository.getObject(pool, +params['poolUserId']).subscribe({
              next: (poolUser: PoolUser) => {
                this.poolUser = poolUser;
                this.initGameRounds(+params.gameRound);
              },
              error: (e: string) => {
                this.setAlert('danger', e); this.processing = false;
              },
              complete: () => this.processing = false
            });
          });
        },
        error: (e) => {
          this.setAlert('danger', e); this.processing = false;
        }
      });
  }

  private getCurrentGameRound(gameRoundParam: number): Observable<GameRound | undefined | CurrentGameRoundNumbers> {

    let currentGameRound = undefined;
    if (gameRoundParam > 0) {
      currentGameRound = this.viewPeriod.getGameRound(gameRoundParam);
    }
    if (currentGameRound !== undefined || gameRoundParam === 0) {
      return of(currentGameRound);
    }
    return this.gameRoundRepository.getCurrentNumbers(this.pool.getCompetitionConfig(), this.viewPeriod);
  }

  private initGameRounds(gameRoundParam: number): void {

    this.getCurrentGameRound(gameRoundParam).subscribe({
      next: (object: GameRound | undefined | CurrentGameRoundNumbers) => {
        let currentGameRound;
        if (object instanceof GameRound) {
          currentGameRound = object;
        } else if (object !== undefined && object.hasOwnProperty('firstNotFinished')) {
          const firstNotFinished = object.lastFinishedOrInPorgress;
          if (typeof firstNotFinished === 'number') {
            currentGameRound = this.viewPeriod.getGameRound(firstNotFinished);
          }
        }
        this.currentGameRound = currentGameRound;

        const gameRounds: (GameRound | undefined)[] = this.viewPeriod.getGameRounds().slice();
        this.gameRounds = gameRounds;
        if (currentGameRound !== undefined) {
          const idx = this.gameRounds.indexOf(this.currentGameRound);
          if (idx >= 0) {
            this.gameRounds = this.gameRounds.splice(idx).concat(this.gameRounds);
          }
          this.gameRounds.push(undefined);
        } else {
          this.gameRounds.unshift(undefined);
        }

        this.updateGameRound(currentGameRound);
      },
      error: (e: string) => { this.setAlert('danger', e); this.processing = false; },
      complete: () => this.processing = false
    });
  }

  // getGameRounds(): (GameRound | undefined)[] {
  //   const gameRounds = this.poolUser?.getPool().getAssembleViewPeriod().getGameRounds();
  //   return gameRounds !== undefined ? gameRounds : [];
  // }

  updateGameRound(gameRound: GameRound | undefined): void {
    if (gameRound === undefined) {
      this.currentGameRound = gameRound;
      return;
    }
    const formation = this.poolUser.getAssembleFormation();
    if (formation === undefined) {
      return;
    }
    this.processingStatistics = true;

    const setStatistics: Observable<StatisticsMap>[] = this.statisticsRepository.getFormationRequests(formation);

    if (setStatistics.length === 0) {
      this.processingStatistics = false;
      this.currentGameRound = gameRound;
      return
    }
    forkJoin(setStatistics).subscribe({
      next: () => {
        this.currentGameRound = gameRound;
        this.processingStatistics = false;
      },
      error: (e) => {
        this.processingStatistics = false;
      }
    });
  }

  getPoolUserName(): string {
    const user = this.poolUser.getUser();
    return this.authService.getUser()?.getId() === user.getId() ? 'mijn team' : '' + user.getName();
  }

  getFormationName(): string {
    return this.poolUser?.getAssembleFormation()?.getName() ?? 'kies formatie';
  }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToPlayer(s11Player: S11Player): void {
    const gameRoundNumber = this.currentGameRound ? this.currentGameRound.getNumber() : 0;
    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), gameRoundNumber]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }

  getTotalPoints(): number {
    const formation = this.poolUser.getAssembleFormation();
    if (formation === undefined) {
      return 0;
    }
    return formation.getPoints(this.currentGameRound);
  }
}
