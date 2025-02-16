import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AgainstGame, AgainstGamePlace, Competition, Player, StartLocationMap, Structure } from 'ngx-sport';
import { concatMap, map, Observable, of } from 'rxjs';
import { GameRound } from '../../lib/gameRound';
import { GamePicker } from '../../lib/gameRound/gamePicker';
import { ImageRepository } from '../../lib/image/repository';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { ViewPeriod } from '../../lib/period/view';
import { S11Player } from '../../lib/player';
import { S11PlayerRepository } from '../../lib/player/repository';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { Statistics } from '../../lib/statistics';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { StatisticsRepository } from '../../lib/statistics/repository';

import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerBasicsComponent } from './basics.component';
import { AgainstGameTitleComponent } from '../game/source/title.component';
import { S11PlayerViewPeriodStatisticsComponent } from '../statistics/viewperiod.component';
import { S11PlayerGameRoundStatisticsComponent } from '../statistics/gameround.component';
import { NgIf } from '@angular/common';

@Component({
  selector: "app-s11player-info",
  standalone: true,
  imports: [
    GameRoundScrollerComponent,
    FontAwesomeModule,
    NgbAlertModule,
    PlayerBasicsComponent,
    GameRoundScrollerComponent,
    AgainstGameTitleComponent,
    S11PlayerViewPeriodStatisticsComponent,
    S11PlayerGameRoundStatisticsComponent,
    NgIf
  ],
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
})
export class S11PlayerComponent extends PoolComponent implements OnInit {
  public s11Player!: S11Player;
  public pool!: Pool;
  public currentGameRound: GameRound | undefined;

  // @Input() team: Team | undefined;
  public processingGames = false;
  public currentGame: AgainstGame | undefined;
  public currentStatistics: Statistics | undefined;
  public currentPoints: number | undefined;
  public sourceStructure: Structure | undefined;
  public startLocationMap!: StartLocationMap;
  public statisticsGetter = new StatisticsGetter();

  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public player: Player | undefined;
  public sliderGameRounds: (GameRound | undefined)[] = [];

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private playerRepository: S11PlayerRepository,
    private statisticsRepository: StatisticsRepository,
    private structureRepository: StructureRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    private myNavigation: MyNavigation
  ) {
    super(route, router, poolRepository, globalEventsManager);
    // const state = this.router.getCurrentNavigation()?.extras.state ?? undefined;
    // if (state !== undefined) {
    //   this.s11Player = state.s11Player;
    //   this.pool = state.pool;
    //   this.currentGameRound = state.gcurrentGameRound ?? undefined;
    // }
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);

      const competitionConfig = this.pool.getCompetitionConfig();

      this.route.params.subscribe((params) => {
        let viewPeriod: ViewPeriod | undefined = undefined;
        let currentGameRound: GameRound | undefined;
        const gameRoundNumber = +params.gameRound;
        if (gameRoundNumber > 1) {
          viewPeriod = pool.getViewPeriodByRoundNumber(gameRoundNumber);
          if (viewPeriod !== undefined) {
            currentGameRound = viewPeriod.getGameRound(gameRoundNumber);
          }
        } else {
          viewPeriod = this.getCurrentViewPeriod(pool);
        }
        this.playerRepository
          .getObject(
            +params.playerId,
            competitionConfig.getSourceCompetition(),
            viewPeriod
          )
          .subscribe({
            next: (s11Player: S11Player) => {
              this.s11Player = s11Player;
              this.statisticsRepository
                .getPlayerObjects(this.s11Player, this.statisticsGetter)
                .subscribe({
                  next: () => {
                    this.startLocationMap = new StartLocationMap(
                      this.pool.getSourceCompetition().getTeamCompetitors()
                    );
                    this.initSliderGameRounds(currentGameRound);
                    this.updateGameRound(currentGameRound, true);
                  },
                });
            },
            error: (e: string) => {
              this.setAlert("danger", e);
              this.processing.set(false);
            },
          });
      });
    });
  }

  private initSliderGameRounds(currentGameRound: GameRound | undefined): void {
    this.sliderGameRounds = this.s11Player
      .getViewPeriod()
      .getGameRounds()
      .slice();
    if (currentGameRound !== undefined) {
      const idx = this.sliderGameRounds.indexOf(currentGameRound);
      if (idx >= 0) {
        const secondPart = this.sliderGameRounds.splice(idx);
        secondPart.push(undefined);
        this.sliderGameRounds = secondPart.concat(this.sliderGameRounds);
      }
    } else {
      this.sliderGameRounds.unshift(undefined);
    }
  }

  getTeamImageUrl(player: Player): string {
    return this.imageRepository.getTeamUrl(player.getTeam());
  }

  getPlayerImageUrl(player: Player): string {
    return this.imageRepository.getPlayerUrl(player);
  }

  updateGameRound(
    currentGameRound: GameRound | undefined,
    disableProcessing?: boolean
  ): void {
    this.currentGameRound = currentGameRound;
    if (currentGameRound === undefined) {
      this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.s11Player);
      this.currentStatistics = undefined;
      this.currentGame = undefined;
      if (disableProcessing) {
        this.processing.set(false);
      }
      return;
    }
    this.currentStatistics = this.statisticsGetter.getStatistics(
      this.s11Player,
      currentGameRound
    );

    if (currentGameRound.hasAgainstGames()) {
      this.currentGame = new GamePicker(
        this.pool.getSourceCompetition(),
        currentGameRound
      ).getGame(this.s11Player);
      if (disableProcessing) {
        this.processing.set(false);
      }
      return;
    }
    this.processingGames = true;
    this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
      next: (structure: Structure) => {
        this.sourceStructure = structure;
        const sourcePoule = structure
          .getSingleCategory()
          .getRootRound()
          .getFirstPoule();

        this.gameRepository
          .getSourceObjects(sourcePoule, currentGameRound)
          .subscribe({
            next: (againstGames: AgainstGame[]) => {
              this.currentGame = new GamePicker(
                this.pool.getSourceCompetition(),
                currentGameRound
              ).getGame(this.s11Player);
              // const out = this.currentGame?.getAgainstPlaces().map((gp: AgainstGamePlace) => {
              //   return '' + gp.getPlace().getPlaceNr();
              // }).join('&');
              // console.log(out);
            },
            complete: () => {
              if (disableProcessing) {
                this.processing.set(false);
              }
              this.processingGames = false;
            },
          });
      },
    });
  }

  getSourceStructure(competition: Competition): Observable<Structure> {
    if (this.sourceStructure !== undefined) {
      return of(this.sourceStructure);
    }
    return this.structureRepository.getObject(competition);
  }

  getCurrentGameRoundPoints(): number {
    if (this.currentGameRound === undefined) {
      return this.s11Player.getTotalPoints(
        this.pool.getCompetitionConfig().getScorePointsMap(),
        undefined
      );
    }
    if (this.currentStatistics === undefined) {
      return 0;
    }
    const map = this.pool.getCompetitionConfig().getScorePointsMap();
    return this.currentStatistics.getPoints(
      this.s11Player.getLine(),
      map,
      undefined
    );
  }

  navigateBack() {
    this.myNavigation.back();
  }
}
