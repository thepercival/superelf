import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { Competition, Poule, Structure, StructureEditor } from 'ngx-sport';
import { LeagueName } from '../../lib/leagueName';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { GameRound } from '../../lib/gameRound';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { ViewPeriod } from '../../lib/period/view';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { AuthService } from '../../lib/auth/auth.service';
import { CompetitionsNavBarItem, NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { ChooseBadgeCategoryModalComponent } from '../badge/choosecategory-modal.component';
import { GameRoundTotalsMap, PoolTotalsRepository, PoolUsersTotalsMap } from '../../lib/totals/repository';
import { SuperElfNameService } from '../../lib/nameservice';
import { DefaultGameRoundCalculator } from '../../lib/gameRound/defaultCalculator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PoolCompetitionsNavBarComponent } from '../../shared/poolmodule/competitionsNavBar/competitionsNavBar.component';
import { WorldCupNavBarComponent } from '../../shared/poolmodule/poolNavBar/worldcupNavBar.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { SuperElfIconComponent } from '../../shared/poolmodule/icon/icon.component';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { SuperElfBadgeIconComponent } from '../../shared/poolmodule/icon/badge.component';
import { TogetherRankingComponent } from './togetherranking.component';


@Component({
  selector: "app-pool-leagues-competition",
  standalone: true,
  imports: [
    FontAwesomeModule,
    PoolCompetitionsNavBarComponent,
    WorldCupNavBarComponent,
    PoolNavBarComponent,
    SuperElfIconComponent,
    GameRoundScrollerComponent,
    SuperElfBadgeIconComponent,
    TogetherRankingComponent,
  ],
  templateUrl: "./competition.component.html",
  styleUrls: ["./competition.component.scss"],
})
export class PoolCompetitionComponent extends PoolComponent implements OnInit {
  poolUsers: PoolUser[] = [];

  public pouleId: string | number | undefined;
  public leagueName!: LeagueName;
  public poolUsersTotalsMap: PoolUsersTotalsMap | undefined;
  public gameRoundTotalsMap: GameRoundTotalsMap = new GameRoundTotalsMap();
  public currentGameRoundPoolUsersTotalsMap: PoolUsersTotalsMap | undefined;
  public badgeCategory: BadgeCategory | undefined;
  public currentGameRound: GameRound | undefined;
  public gameRounds: (GameRound | undefined)[] = [];
  public nrOfUnreadMessages = 0;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected structureEditor: StructureEditor,
    protected poolUserRepository: PoolUserRepository,
    protected chatMessageRepository: ChatMessageRepository,
    protected structureRepository: StructureRepository,
    protected poolTotalsRepository: PoolTotalsRepository,
    private gameRoundRepository: GameRoundRepository,
    private defaultGameRoundCalculator: DefaultGameRoundCalculator,
    public nameService: SuperElfNameService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        this.setLeagueName(pool.getCompetitions());
        const competitionConfig = pool.getCompetitionConfig();
        const currentViewPeriod: ViewPeriod = this.getCurrentViewPeriod(pool);
        if (currentViewPeriod === undefined) {
          this.setAlert("info", "geen bekijk-periode gevonden");
          return;
        }
        this.currentViewPeriod = currentViewPeriod;        
        const user = this.authService.getUser();
        this.gameRounds = currentViewPeriod.getGameRounds();
        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => {
            this.poolUsers = poolUsers;
            this.poolUserFromSession = poolUsers.find(
              (poolUser: PoolUser) => poolUser.getUser() === user
            );
            const competition = pool.getCompetition(this.leagueName);
            if (competition === undefined) {
              this.processing = false;
              throw Error("competitionSport not found");
            }

            if (this.poolUserFromSession) {
              this.structureRepository.getFirstPouleId(competition).subscribe({
                next: (pouleId: string | number) => {
                  if (pouleId) {
                    this.chatMessageRepository
                      .getNrOfUnreadObjects(pouleId, pool)
                      .subscribe({
                        next: (nrOfUnreadMessages: number) => {
                          this.nrOfUnreadMessages = nrOfUnreadMessages;
                        },
                      });
                  }
                  this.pouleId = pouleId;
                },
              });
            }
            this.initPoolUsersTotals(pool,currentViewPeriod);
            this.initCurrentGameRound(pool, currentViewPeriod);
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing = false;
          },
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing = false;
      },
    });
  }

  get Competitions(): NavBarItem {
    return NavBarItem.Competitions;
  }
  get PouleRankingTogetherSport(): CompetitionsNavBarItem {
    return CompetitionsNavBarItem.PouleRankingTogetherSport;
  }
  get WorldCupLeagueName(): LeagueName {
    return LeagueName.WorldCup;
  }

  setLeagueName(competitions: Competition[]): void {
    const hasWorldCup =
      false; /*competitions.some((competition: Competition): boolean => {
      return competition.getLeague().getName() === LeagueName.WorldCup;
    })*/
    this.leagueName = hasWorldCup
      ? LeagueName.WorldCup
      : LeagueName.Competition;
  }

  initPoolUsersTotals(pool: Pool, viewPeriod: ViewPeriod): void {
    const assembleViewPeriod = pool.getAssembleViewPeriod();

    this.poolTotalsRepository
      .getViewPeriodPoolUsersMap(pool, assembleViewPeriod)
      .subscribe({
        next: (assemblePoolUsersTotalsMap: PoolUsersTotalsMap) => {
          this.poolUsersTotalsMap = assemblePoolUsersTotalsMap;
          if (assembleViewPeriod !== viewPeriod) {
            this.poolTotalsRepository
              .getViewPeriodPoolUsersMap(pool, viewPeriod)
              .subscribe({
                next: (poolUsersTotalsMap: PoolUsersTotalsMap) => {
                  // console.log(poolUsersTotalsMap);
                  assemblePoolUsersTotalsMap.add(poolUsersTotalsMap);
                },
                error: (e: string) => {
                  this.setAlert("danger", e);
                },
              });
          }
        },
        error: (e: string) => {
          this.setAlert("danger", e);
        },
      });
  }

  initCurrentGameRound(
    pool: Pool,
    viewPeriod: ViewPeriod
  ): void {
      const competitionConfig: CompetitionConfig = pool.getCompetitionConfig();
      this.defaultGameRoundCalculator
        .calculateFinished(competitionConfig, viewPeriod, undefined)
        .subscribe({
          next: (currentGameRound: GameRound) => {
            const gameRounds: (GameRound | undefined)[] = viewPeriod
              .getGameRounds()
              .slice();
            this.gameRounds = gameRounds;

            const idx = this.gameRounds.indexOf(currentGameRound);
            if (idx >= 0) {
              this.gameRounds = this.gameRounds
                .splice(idx)
                .concat([], this.gameRounds);
            }
            this.updateGameRound(pool, currentGameRound);
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing = false;
          },
        });
  }

  public updateViewPeriodFromScroller(
    pool: Pool,
    viewPeriod: ViewPeriod
  ): void {
    this.processing = true;
    this.currentViewPeriod = viewPeriod;
    this.initPoolUsersTotals(pool,viewPeriod);
    this.initCurrentGameRound(pool, viewPeriod);
  }

  updateGameRoundFromScroller(pool: Pool, gameRound: GameRound | undefined): void {
    if (gameRound === undefined) {
      this.currentGameRound = gameRound;
      this.currentGameRoundPoolUsersTotalsMap = undefined;
      return;
    }
    this.updateGameRound(pool,gameRound);
  }

  updateGameRound(pool: Pool, gameRound: GameRound): void {
    this.processing = true;
    this.poolTotalsRepository
      .getGameRoundPoolUsersMap(pool, gameRound)
      .subscribe({
        next: (gameRoundPoolUsersTotals: PoolUsersTotalsMap) => {
          this.currentGameRound = gameRound;
          // HIER KIJKEN HOE JE DEZE MOET OPBOUWEN, ALS AL BESTAAT DAN NIET NOG EENS OPHALEN VAN SERVER
          this.gameRoundTotalsMap.set(
            this.getGameRoundIndex(gameRound),
            gameRoundPoolUsersTotals
          );
          this.currentGameRoundPoolUsersTotalsMap = gameRoundPoolUsersTotals;
          this.processing = false;
        },
        error: (e: string) => {
          this.setAlert("danger", e);
          this.processing = false;
        },
      });
  }

  private getGameRoundIndex(gameRound: GameRound): string {
    return gameRound.getViewPeriod().getId() + "-" + gameRound.getNumber();
  }

  navigateToChat(pool: Pool, pouleId: string | number): void {
    this.router.navigate([
      "/pool/chat",
      pool.getId(),
      this.leagueName,
      pouleId,
    ]);
  }

  openChooseBadgeCategoryModal(): void {
    const modalRef = this.modalService.open(ChooseBadgeCategoryModalComponent);
    modalRef.componentInstance.currentBadgeCategory = this.badgeCategory;
    modalRef.result.then(
      (choosenBadgeCategory: BadgeCategory | undefined) => {
        this.badgeCategory = choosenBadgeCategory;
      },
      (reason) => {}
    );
  }
}
