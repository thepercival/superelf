import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../src/app/lib/auth/auth.service';
import { CSSService } from '../../src/app/shared/commonmodule/cssservice';
import { PoolComponent } from '../../src/app/shared/poolmodule/component';
import { TranslateService } from '../../src/app/lib/translate';
import { PoolRepository } from '../../src/app/lib/pool/repository';
import { Pool } from '../../src/app/lib/pool';
import { ScoutedPlayerRepository } from '../../src/app/lib/scoutedPlayer/repository';
import { PoolUser } from '../../src/app/lib/pool/user';
import { PoolUserRepository } from '../../src/app/lib/pool/user/repository';
import { S11Formation } from '../../src/app/lib/formation';
import { ScoutedPlayer } from '../../src/app/lib/scoutedPlayer';
import { GlobalEventsManager } from '../../src/app/shared/commonmodule/eventmanager';
import { DateFormatter } from '../../src/app/lib/dateFormatter';
import { PoolCompetitor } from '../../src/app/lib/pool/competitor';
import { LeagueName } from '../../src/app/lib/leagueName';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../src/app/lib/gameRound/repository';
import { AgainstGame, Competition, Formation, Period, Poule, Round, Structure, TogetherGame, TogetherGamePlace } from 'ngx-sport';
import { StructureRepository } from '../../src/app/lib/ngx-sport/structure/repository';
import { SuperElfNameService } from '../../src/app/lib/nameservice';
import { CompetitionConfigRepository } from '../../src/app/lib/competitionConfig/repository';
import { S11FormationCalculator } from '../../src/app/lib/formation/calculator';
import { NavBarItem } from '../../src/app/shared/poolmodule/poolNavBar/items';
import { NgIf } from '@angular/common';

@Component({
  selector: "app-pool-public",
  standalone: true,
  imports: [NgIf],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends PoolComponent implements OnInit {
  public translate: TranslateService;
  public scoutedPlayers: ScoutedPlayer[] = [];
  public scoutingEnabled: boolean = false;
  public leagueNames: LeagueName[] = [
    LeagueName.Competition,
    LeagueName.Cup,
    LeagueName.SuperCup,
  ];
  public poolUsers: PoolUser[] = [];
  public currentGameRoundNumbers: CurrentGameRoundNumbers | undefined;
  public structureMap = new Map<number, Structure>();
  private processingGameRoundNumbers = true;
  private processingPoolUsers = true;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    public cssService: CSSService,
    public superElfNameService: SuperElfNameService,
    private dateFormatter: DateFormatter,
    private authService: AuthService,
    private poolUserRepository: PoolUserRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    protected gameRoundRepository: GameRoundRepository,
    protected structureRepository: StructureRepository,
    protected competitionConfigRepository: CompetitionConfigRepository,
    protected modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.translate = new TranslateService();
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        this.postNgOnInit(pool);
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  postNgOnInit(pool: Pool) {
    const competitionConfig = pool.getCompetitionConfig();
    this.scoutingEnabled =
      pool.getCreateAndJoinPeriod().isIn() || pool.getAssemblePeriod().isIn();
    if (this.scoutingEnabled) {
      // const viewPeriod = pool.getAssembleViewPeriod();
      const competition = pool.getSourceCompetition();
      this.scoutedPlayerRepository
        .getObjects(competition, pool.getCreateAndJoinPeriod())
        .subscribe((scoutedPlayers: ScoutedPlayer[]) => {
          this.scoutedPlayers = scoutedPlayers;
        });
    }

    if (competitionConfig.afterAssemblePeriod()) {
      this.gameRoundRepository
        .getCurrentNumbers(competitionConfig, this.getCurrentViewPeriod(pool))
        .subscribe({
          next: (currentGameRoundNumbers: CurrentGameRoundNumbers) => {
            // console.log(currentGameRoundNumbers);
            this.currentGameRoundNumbers = currentGameRoundNumbers;
            this.setStructureMap(this.getCompetitions(pool));
            if (!this.processingPoolUsers) {
              this.processing.set(false);
            } else {
              this.processingGameRoundNumbers = false;
            }
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing.set(false);
          },
        });
    } else {
      this.processingGameRoundNumbers = false;
    }

    this.initPoolUsers(pool);
  }

  // get PouleRankingTogetherSport(): NavBarItem { return NavBarItem.PouleRankingTogetherSport }

  initPoolUsers(pool: Pool) {
    if (
      pool.getCreateAndJoinPeriod().isIn() ||
      pool.getAssemblePeriod().isIn()
    ) {
      this.poolUserRepository
        .getObjects(pool)
        .subscribe((poolUsers: PoolUser[]) => {
          this.poolUsers = poolUsers;
          if (!this.processingGameRoundNumbers) {
            this.processing.set(false);
          } else {
            this.processingPoolUsers = false;
          }
        });
    } else {
      if (!this.processingGameRoundNumbers) {
        this.processing.set(false);
      } else {
        this.processingPoolUsers = false;
      }
    }

    // if( this.authService.isLoggedIn() ) {
    //     this.poolUserRepository.getObjectFromSession(pool)
    //     .subscribe({
    //         next: (poolUser: PoolUser | undefined) => {
    //             this.poolUser = poolUser;
    //             // if (this.inTransferMode()) {
    //             //     this.competitionConfigRepository.getAvailableFormations(pool.getCompetitionConfig())
    //             //         .subscribe((formations: Formation[]) => {
    //             //             this.formationChecker = new FootballFormationChecker(formations);
    //             //         });
    //             // }
    //         },
    //         error: (e: string) => {
    //             this.setAlert('danger', e); this.processing.set(false);
    //         }
    //     });
    // }
  }

  getCompetitions(pool: Pool): Competition[] {
    const competitions: Competition[] = [];
    this.leagueNames.forEach((leagueName: LeagueName) => {
      const competition = pool.getCompetition(leagueName);
      if (competition) {
        competitions.push(competition);
      }
    });
    return competitions;
  }

  setStructureMap(competitions: Competition[]): void {
    competitions.forEach((competition: Competition) => {
      this.structureRepository.getObject(competition).subscribe({
        next: (structure: Structure) => {
          this.structureMap.set(+competition.getId(), structure);
        },
      });
    });
  }

  getNrOfPoolUsersHaveAssembled(): number {
    return this.poolUsers.filter(
      (poolUser) =>
        poolUser.getNrOfAssembled() === S11Formation.FootbalNrOfPersons
    ).length;
  }

  allPoolUsersHaveAssembled(): boolean {
    return this.poolUsers.length === this.getNrOfPoolUsersHaveAssembled();
  }

  getCompetitionCompetitors(pool: Pool): PoolCompetitor[] {
    return pool.getCompetitors(LeagueName.Competition);
  }

  getCupCompetitors(pool: Pool): PoolCompetitor[] {
    return pool.getCompetitors(LeagueName.Cup);
  }

  openModal(modalContent: TemplateRef<any>) {
    const activeModal = this.modalService.open(modalContent);
    activeModal.result.then(
      () => {},
      () => {}
    );
  }

  get Competition(): LeagueName {
    return LeagueName.Competition;
  }
  get Cup(): LeagueName {
    return LeagueName.Cup;
  }
  get SuperCup(): LeagueName {
    return LeagueName.SuperCup;
  }

  isFinished(competition: Competition): boolean {
    const structure = this.structureMap.get(+competition.getId());
    return structure?.getLastRoundNumber().hasFinished() ?? false;
  }

  hasGameRoundNumber(
    competition: Competition,
    gameRoundNumber: number
  ): boolean {
    return this.getCurrentRound(competition, gameRoundNumber) !== undefined;
  }

  getCurrentRound(
    competition: Competition,
    gameRoundNumber: number
  ): Round | undefined {
    const structure = this.structureMap.get(+competition.getId());
    if (structure === undefined) {
      return undefined;
    }

    const round = structure.getSingleCategory().getRootRound();
    return this.getCurrentRoundHelper(round, gameRoundNumber);
  }

  // getCurrentRound(structure: Structure, gameRoundNumber: number): Round|undefined {
  //     const round = structure.getSingleCategory().getRootRound();
  //     return this.getCurrentRoundHelper(round, gameRoundNumber);
  // }

  getCurrentRoundHelper(
    round: Round,
    gameRoundNumber: number
  ): Round | undefined {
    if (this.hasRoundGameRoundNumber(round, gameRoundNumber)) {
      return round;
    }
    return round.getChildren().find((childRound: Round): boolean => {
      return this.hasRoundGameRoundNumber(childRound, gameRoundNumber);
    });
  }

  hasRoundGameRoundNumber(round: Round, gameRoundNumber: number): boolean {
    return round
      .getGames()
      .some((game: AgainstGame | TogetherGame): boolean => {
        if (game instanceof TogetherGame) {
          return game
            .getTogetherPlaces()
            .some((gamePlace: TogetherGamePlace): boolean => {
              return gamePlace.getGameRoundNumber() === gameRoundNumber;
            });
        }
        return game.getGameRoundNumber() === gameRoundNumber;
      });
  }

  getScheduleBorderClass(
    competition: Competition,
    gameRoundNumber: number
  ): string {
    // const lastFinishedOrInPorgress = this.currentGameRoundNumbers?.lastFinishedOrInPorgress;
    // if( lastFinishedOrInPorgress === undefined) {
    //     return 'border-0';
    // }
    const hasGameRoundNumber = this.hasGameRoundNumber(
      competition,
      gameRoundNumber
    );
    if (hasGameRoundNumber) {
      // if( poolUserQualified() ) {
      return "border-positive";
      // }
    }
    return "";
  }

  // navigateToSchedule(competition: Competition, gameRoundNumber: number): void {
  //     const leagueName = this.superElfNameService.convertToLeagueName(competition);
  //     if( leagueName === LeagueName.Competition) {
  //         this.router.navigate(['/pool/togethergame', this.pool.getId(), gameRoundNumber, 0]);
  //         return;
  //     }
  //     if (leagueName === LeagueName.SuperCup) {
  //         this.router.navigate(['/pool/poule-againstgames', this.pool.getId(), leagueName, 0]);
  //         return;
  //     }
  //     const currentRound = this.getCurrentRound(competition, gameRoundNumber);
  //     let currentPoule = undefined;
  //     if( currentRound !== undefined && this.poolUser !== undefined ) {
  //         currentPoule = this.getCurrentPoule(currentRound, leagueName, this.poolUser);
  //     }
  //     if (currentPoule !== undefined) {
  //         this.router.navigate(['/pool/poule-againstgames', this.pool.getId(), leagueName, currentPoule.getId()]);
  //     } else {
  //         this.router.navigate(['/pool/cup', this.pool.getId()]);
  //     }
  // }

  getCurrentPoule(
    round: Round,
    leagueName: LeagueName,
    poolUser: PoolUser
  ): Poule | undefined {
    const competitor = poolUser.getCompetitor(leagueName);
    if (competitor === undefined) {
      return undefined;
    }
    return round.getPoules().find((poule: Poule): boolean => {
      return (
        poule.getPlaceByStartLocation(competitor.getStartLocation()) !==
        undefined
      );
    });
  }

  // getCurrentStructureCell(structureCell: StructureCell): StructureCell {
  //     const gamesState = structureCell.getGamesState();
  //     if (gamesState !== GameState.Finished) {
  //         return structureCell;
  //     }
  //     const nextStructureCell = structureCell.getNext();
  //     if (nextStructureCell === undefined) {
  //         return structureCell;
  //     }
  //     return this.getCurrentStructureCell(nextStructureCell);
  // }

  // getNrOfPoolUsersHaveTransfered(): number {
  //     const max = this.pool.getTransferPeriod().getMaxNrOfTransfers();
  //     return this.poolUsers.filter(poolUser => poolUser.getNrOfTransferedWithTeam() === max).length;
  // }

  // allPoolUsersHaveTransfered(): boolean {
  //     return this.poolUsers.length === this.getNrOfPoolUsersHaveTransfered();
  // }

  linkToAssemble() {
    // if (!this.inAssembleMode()) {
    //     return;
    // }
    // if (this.poolUser?.getAssembleFormation() !== undefined) {
    //     this.router.navigate(['/pool/formation/assemble', this.pool.getId()]);
    // } else {
    //     this.router.navigate(['/pool/formation/choose', this.pool.getId()]);
    // }
  }

  linkToTransferPeriodAction(poolUser: PoolUser) {
    // const transferPeriod = poolUser.getPool().getCompetitionConfig().getTransferPeriod();
    // if( !(new S11FormationCalculator()).areAllPlacesWithoutTeamReplaced(poolUser) ) {
    //     this.router.navigate(['/pool/formation/replacements', this.pool.getId()]);
    //   } else if( poolUser.getTransfers().length < transferPeriod.getMaxNrOfTransfers()) {
    //     this.router.navigate(['/pool/formation/transfers', this.pool.getId()]);
    //   } else {
    //     this.router.navigate(['/pool/formation/substitutions', this.pool.getId()]);
    //   }
  }

  showAssemble(pool: Pool): boolean {
    const now = new Date();
    return pool.getAssemblePeriod().isIn();
  }

  inAssembleMode(pool: Pool): boolean {
    return pool.getAssemblePeriod().isIn();
  }

  inBeforeStart(pool: Pool): boolean {
    return pool.getStartDateTime().getTime() > new Date().getTime();
  }

  inBeforeAssemble(pool: Pool): boolean {
    return (
      pool.getAssemblePeriod().getStartDateTime().getTime() >
      new Date().getTime()
    );
  }

  getStartAssembleDate(pool: Pool): string {
    return (
      "vanaf " +
      this.dateFormatter.toString(
        pool.getAssemblePeriod().getStartDateTime(),
        this.dateFormatter.niceDateTime()
      ) +
      " uur"
    );
  }

  // getNrAssembled(): number {
  //     return (this.poolUser?.getNrOfAssembled() ?? 0);
  // }
}
