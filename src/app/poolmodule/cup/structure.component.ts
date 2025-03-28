import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { CompetitionSport, Poule, StartLocationMap, Structure, StructureEditor, StructureNameService } from 'ngx-sport';
import { LeagueName } from '../../lib/leagueName';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { GameRound } from '../../lib/gameRound';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { AuthService } from '../../lib/auth/auth.service';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { CompetitionsNavBarItem, NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PoolCupRoundComponent } from './round.component';
import { PoolCompetitionsNavBarComponent } from '../../shared/poolmodule/competitionsNavBar/competitionsNavBar.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { NgIf } from '@angular/common';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: "app-pool-cup",
  standalone: true,
  imports: [
    FontAwesomeModule,
    PoolCupRoundComponent,
    PoolCompetitionsNavBarComponent,
    PoolNavBarComponent,
    NgIf,
  ],
  templateUrl: "./structure.component.html",
  styleUrls: ["./structure.component.scss"],
})
export class PoolCupComponent extends PoolComponent implements OnInit {
  poolUsers: PoolUser[] = [];

  public poule!: Poule;
  public competitionSport!: CompetitionSport;
  public startLocationMap!: StartLocationMap;
  protected structureNameService!: StructureNameService;
  public currentGameRound: GameRound | undefined;
  public gameRounds: GameRound[] = [];
  public leagueName = LeagueName.Cup;
  public faSpinner = faSpinner;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected structureEditor: StructureEditor,
    protected poolUserRepository: PoolUserRepository,
    protected structureRepository: StructureRepository,
    protected authService: AuthService,
    private gameRoundRepository: GameRoundRepository,
    private modalService: NgbModal,
    private myNavigation: MyNavigation
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        const competitionConfig = pool.getCompetitionConfig();
        const currentViewPeriod = pool.getCurrentViewPeriod();
        if (currentViewPeriod === undefined) {
          return;
        }
        const user = this.authService.getUser();
        // @TODO CDK
        // this.gameRounds = currentViewPeriod.getGameRounds();
        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => {
            this.poolUsers = poolUsers;
            this.poolUserFromSession = poolUsers.find(
              (poolUser: PoolUser) => poolUser.getUser() === user
            );

            const competition = pool.getCompetition(this.leagueName);
            if (competition === undefined) {
              this.processing.set(false);
              throw Error("competitionSport not found");
            }

            this.structureRepository.getObject(competition).subscribe({
              next: (structure: Structure) => {
                // -----------  JE TOONT VOOR EEN BEPAALDE VIEWPERIODE -------------- //
                // DE GAMEROUNDS ZIJN DAN DE WEDSTRIJDEN EN DE POOLUSERS MET HUN PUNTEN PER GAMEROUND ZIJN DAN DE GAMEROUND-SCORE
                const poolCompetitors = pool.getCompetitors(this.leagueName);
                const round = structure.getSingleCategory().getRootRound();
                this.poule = round.getFirstPoule(); // ?? GET FROM BACKEND ?? this.pool.getCompetition(PoolCollection.League_Default).get;
                this.competitionSport = pool.getCompetitionSport(
                  this.leagueName
                );
                this.startLocationMap = new StartLocationMap(poolCompetitors);
                this.structureNameService = new StructureNameService(
                  this.startLocationMap
                );

                // gameRoundScores voor competitors of poolCompetitions
                // getGAMES!!

                this.initCurrentGameRound(competitionConfig, currentViewPeriod);
              },
              error: (e: string) => {
                this.setAlert("danger", e);
                this.processing.set(false);
              },
            });
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing.set(false);
          },
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  get Competitions(): NavBarItem {
    return NavBarItem.Competitions;
  }
  get CupStructure(): CompetitionsNavBarItem {
    return CompetitionsNavBarItem.CupStructure;
  }

  initCurrentGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): void {
    // @TODO CDK
    // this.gameRoundRepository
    //   .getCurrentNumbers(competitionConfig, viewPeriod)
    //   .subscribe({
    //     next: (currentGameRoundNumbers: CurrentGameRoundNumbers) => {
    //       let currentGameRound;
    //       if (currentGameRoundNumbers.lastFinishedOrInProgresss) {
    //         currentGameRound = viewPeriod.getGameRound(
    //           currentGameRoundNumbers.lastFinishedOrInProgresss
    //         );
    //       }
    //       this.currentGameRound = currentGameRound;
    //       if (this.currentGameRound !== undefined) {
    //         // console.log('CDK', this.currentGameRound, this.gameRounds[0]);
    //         while (this.currentGameRound !== this.gameRounds[0]) {
    //           const gameRound = this.gameRounds.shift();
    //           if (gameRound !== undefined) {
    //             this.gameRounds.push(gameRound);
    //           }
    //         }
    //       }
    //       this.updateGameRound(currentGameRound);
    //     },
    //     error: (e: string) => {
    //       this.setAlert("danger", e);
    //       this.processing.set(false);
    //     },
    //     complete: () => this.processing.set(false),
    //   });
  }

  updateGameRound(gameRound: GameRound | undefined): void {
    this.currentGameRound = gameRound;
  }

  navigateBack() {
    this.myNavigation.back();
  }

  navigateToPoule(pool: Pool, poule: Poule): void {
    this.router.navigate([
      "/pool/poule-againstgames",
      pool.getId(),
      this.leagueName,
      poule.getId(),
    ]);
  }
}
