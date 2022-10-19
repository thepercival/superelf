import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competition, Competitor, CompetitorBase, GameState, Player, Poule, Round, StartLocationMap, Structure, Team, TeamCompetitor } from 'ngx-sport';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../../lib/auth/auth.service';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { DateFormatter } from '../../lib/dateFormatter';
import { S11Formation } from '../../lib/formation';
import { S11FormationPlace } from '../../lib/formation/place';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { LeagueName } from '../../lib/leagueName';
import { SuperElfNameService } from '../../lib/nameservice';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { AssemblePeriod } from '../../lib/period/assemble';
import { TransferPeriod } from '../../lib/period/transfer';
import { StatisticsMap } from '../../lib/player';
import { Pool } from '../../lib/pool';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { StatisticsRepository } from '../../lib/statistics/repository';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';

@Component({
  selector: 'app-pool-poule',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PoolPouleComponent extends PoolComponent implements OnInit {
  public gameRounds: (GameRound | undefined)[] = [];
  public currentGameRound: GameRound | undefined;

  public homeCompetitor: PoolCompetitor | undefined;
  public awayCompetitor: PoolCompetitor | undefined;

  public leagueName!: LeagueName;
  public sourceGames: AgainstGame[] = [];
  // private sideMap: SideMap|undefined;
  public poolPoule: Poule | undefined;
  public poolStartLocationMap!: StartLocationMap;
  private startLocationMap!: StartLocationMap;

  public processing = true;
  public processingPoolUsers = true;
  public processingGameRound = true;
  public poolCompetitors: PoolCompetitor[] = [];
  public gotStatistics: boolean = false;

  public sourcePoule!: Poule;
  public nrOfUnreadMessages = 0;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private statisticsRepository: StatisticsRepository,
    private poolUserRepository: PoolUserRepository,
    private structureRepository: StructureRepository,
    protected chatMessageRepository: ChatMessageRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    public nameService: SuperElfNameService,
    public dateFormatter: DateFormatter,
    private authService: AuthService,
    private myNavigation: MyNavigation) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);

      this.route.params.subscribe(params => {
        this.leagueName = params['leagueName'];

        // begin met het ophalen van de wedstrijden van de poolcompetitie
        const poolCompetition = this.pool.getCompetition(this.leagueName);
        if (poolCompetition === undefined) {
          this.processing = false;
          throw Error('competitionSport not found');
        }
        const user = this.authService.getUser();

        this.structureRepository.getObject(poolCompetition).subscribe({
          next: (structure: Structure) => {

            const round = structure.getSingleCategory().getRootRound();
            const pouleId = +params.pouleId;
            const poule = this.leagueName === LeagueName.SuperCup ? round.getFirstPoule(): this.getPouleById(round, pouleId);
            this.poolPoule = poule;

            this.poolUserRepository.getObjects(pool).subscribe((poolUsers: PoolUser[]) => {
              this.poolUser = poolUsers.find((poolUser: PoolUser) => poolUser.getUser() === user);
              const poolCompetitors = pool.getCompetitors(this.leagueName);
              this.initPouleCompetitors(poule, poolCompetitors);
              this.poolStartLocationMap = new StartLocationMap(poolCompetitors);

              if (this.poolUser) {
                this.chatMessageRepository.getNrOfUnreadObjects(poule, pool).subscribe({
                  next: (nrOfUnreadMessages: number) => {
                    this.nrOfUnreadMessages = nrOfUnreadMessages;
                  }
                });
              }
            });

            const gameRoundNumbers: number[] = poule.getAgainstGames().map((game: AgainstGame) => game.getGameRoundNumber());
            const currentGameRoundNumber = this.getCurrentSourceGameRoundNumber(poule);

            // source
            this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
              next: (structure: Structure) => {
                const sourcePoule = structure.getSingleCategory().getRootRound().getFirstPoule();
                this.sourcePoule = sourcePoule;

                const competitors = sourcePoule.getCompetition().getTeamCompetitors();
                this.startLocationMap = new StartLocationMap(competitors);

                const currentViewPeriod = this.getCurrentViewPeriod(this.pool);
                this.gameRounds = currentViewPeriod.mapGameRoundNumbers(gameRoundNumbers);
                const gameRound = currentViewPeriod.getGameRound(currentGameRoundNumber);

                this.processing = false;

                this.updateGameRound(gameRound);
              }
            });

            // this.initCurrentGameRound(competitionConfig, currentViewPeriod);
          },
          error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
        });
      });
    });
  }

  get Created(): GameState { return GameState.Created; }
  get Finished(): GameState { return GameState.Finished; }
  get HomeSide(): AgainstSide { return AgainstSide.Home; }
  get AwaySide(): AgainstSide { return AgainstSide.Away; }

  private getPouleById(round: Round, pouleId: number): Poule {
    if (pouleId === 0) {
      return round.getFirstPoule();
    }
    const poule = round.getPoules().find((poule: Poule): boolean => poule.getId() === pouleId);
    if (poule !== undefined) {
      return poule;
    }
    throw new Error('poule not found for pouleId ' + pouleId);
  }

  private initPouleCompetitors(poolPoule: Poule, poolCompetitors: PoolCompetitor[]): void {
    const homeStartLocation = poolPoule.getPlace(1).getStartLocation();
    if (homeStartLocation) {
      this.homeCompetitor = poolCompetitors.find((competitor: PoolCompetitor) => competitor.getStartLocation().equals(homeStartLocation));
    }
    const awayStartLocation = poolPoule.getPlace(2).getStartLocation();
    if (awayStartLocation) {
      this.awayCompetitor = poolCompetitors.find((competitor: PoolCompetitor) => competitor.getStartLocation().equals(awayStartLocation));
    }
  }

  getCurrentSourceGameRoundNumber(poule: Poule): number {
    const firstInPogress = poule.getAgainstGames().find((game: AgainstGame) => game.getState() === GameState.InProgress);
    if (firstInPogress !== undefined) {
      return firstInPogress.getGameRoundNumber();
    }

    const lastFinished = poule.getAgainstGames().slice().reverse().find((game: AgainstGame) => game.getState() === GameState.Finished);
    if (lastFinished !== undefined) {
      return lastFinished.getGameRoundNumber();
    }
    const firstCreated = poule.getAgainstGames().find((game: AgainstGame) => game.getState() === GameState.Created);
    if (firstCreated !== undefined) {
      return firstCreated.getGameRoundNumber();
    }
    throw new Error('should be a gameroundnumber');
  }

  getCurrentPoolGame(currentGameRound: GameRound): AgainstGame | undefined {
    return this.poolPoule?.getAgainstGames().find((game: AgainstGame): boolean => game.getGameRoundNumber() === currentGameRound.getNumber());
  }

  getPoolGamePoints(currentGameRound: GameRound, competitor: PoolCompetitor): number {
    const poolGame = this.getCurrentPoolGame(currentGameRound);
    if (poolGame === undefined) {
      return 0;
    }
    const finalScore = poolGame.getScores()[0];
    if (finalScore === undefined) {
      return 0;
    }
    const side = this.hasPoolCompetitor(poolGame, AgainstSide.Home, competitor) ? AgainstSide.Home : AgainstSide.Away;

    return side === AgainstSide.Home ? finalScore.getHome() : finalScore.getAway();
  }

  getSourceStructure(competition: Competition): Observable<Structure> {
    // if (this.sourceStructure !== undefined) {
    //   return of(this.sourceStructure);
    // }
    return this.structureRepository.getObject(competition);
  }

  getGameRoundByNumber(gameRoundNumber: number): GameRound {
    const viewPeriods = this.pool.getCompetitionConfig().getViewPeriods();

    let viewPeriod = viewPeriods.shift();
    while (viewPeriod !== undefined) {
      try {
        return viewPeriod.getGameRound(gameRoundNumber);
      } catch (any) {

      }
      viewPeriod = viewPeriods.shift();
    }
    throw new Error('gameRound could not be found for number "' + gameRoundNumber + '"');
  }

  updateGameRound(gameRound: GameRound | undefined): void {

    this.processingGameRound = true;

    const editPeriod = this.getCurrentEditPeriod(this.pool);

    if (gameRound === undefined || editPeriod === undefined) {
      console.error('gameRound or editPeriod is undefined');
      this.processingGameRound = false;
      return;
    }

    this.currentGameRound = gameRound;

    this.gameRepository.getSourceObjects(this.sourcePoule, gameRound).subscribe({
      next: (games: AgainstGame[]) => {
        this.sourceGames = games;
        // this.sideMap = this.getSideMap(games);

        if (this.gotStatistics) {
          this.processingGameRound = false;
          return;
        }
        forkJoin(this.getStatisticsRequests(editPeriod)).subscribe({
          next: () => {
            this.processingGameRound = false;
            this.gotStatistics = true;
          },
          error: (e) => {
            this.processingGameRound = false;
          }
        });
      }
    });
  }

  // private getSideMap(games: AgainstGame[]): SideMap {
  //   const sideMap: SideMap = new Map();

  //   // 
  //   [AgainstSide.Home, AgainstSide.Away].forEach((side: AgainstSide) => {

  //     // const teams = this.getTeamsFromGames(games);

  //     sideMap.set(side, this.getFormationPlacesMap(teams));
  //   });
  //   return sideMap;
  // }

  // private getFormationPlacesMap(formation: S11Formation, date: Date): FormationPlacesMap {
  //   const formationPlacesMap: FormationPlacesMap = new Map();

  //   formation.getPlaces().forEach((formationPlace: S11FormationPlace) => {
  //     formationPlace.getPlayer()?.getPlayer(date)
  //     formationPlacesMap.set(+team.getId(), this.getFormationPlaces(games));
  //   });
  //   return formationPlacesMap;
  // }

  //   const editPeriod = this.getCurrentEditPeriod(this.pool);
  //   const formation = editPeriod ? competitor.getPoolUser().getFormation(editPeriod) : undefined;
  //   // const team = this.getTeam(sourceGame.getSidePlaces(side));
  //   if (formation === undefined/* || team === undefined*/) {
  //     return [];
  //   }
  //   // @TODO CDK ORDER BY TEAMS
  //   const teams = this.getTeams(sourceGame);
  //   console.log(teams);
  //   let formationPlaces: S11FormationPlace[] = [];
  //   teams.forEach((team: Team | undefined) => {
  //     if (team === undefined) {
  //       return undefined;
  //     }


  //     formationPlaces = formationPlaces.concat(formation.getPlaces().filter((formationPlace: S11FormationPlace): boolean => {
  //       const s11Player = formationPlace.getPlayer();
  //       if (s11Player === undefined) {
  //         return false;
  //       }
  //       return s11Player.getPlayer(team) !== undefined;
  //     })
  //     );
  //   });


  getStatisticsRequests(editPeriod: AssemblePeriod | TransferPeriod): Observable<StatisticsMap>[] {
    const setStatistics: Observable<StatisticsMap>[] = [];

    const homeFormation = this.homeCompetitor?.getPoolUser().getFormation(editPeriod)
    if (homeFormation) {
      this.statisticsRepository.getFormationRequests(homeFormation).forEach((request: Observable<StatisticsMap>) => {
        setStatistics.push(request);
      });
    }
    const awayFormation = this.awayCompetitor?.getPoolUser().getFormation(editPeriod)
    if (awayFormation) {
      this.statisticsRepository.getFormationRequests(awayFormation).forEach((request: Observable<StatisticsMap>) => {
        setStatistics.push(request);
      });
    }
    return setStatistics;
  }



  hasPoolCompetitor(game: AgainstGame, side: AgainstSide, competitor: PoolCompetitor): boolean {
    return game.getSidePlaces(side).some((gamePlace: AgainstGamePlace): boolean => {
      const startLocation = gamePlace.getPlace().getStartLocation();
      return startLocation ? this.poolStartLocationMap.getCompetitor(startLocation) === competitor : false;
    });
  }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }

  getFormationPlacesLines(sourceGame: AgainstGame, team: Team): FormationPlacesLine[] {
    const homeFormationPlaces = this.getFormationPlaces(sourceGame, AgainstSide.Home, team);
    const awayFormationPlaces = this.getFormationPlaces(sourceGame, AgainstSide.Away, team);

    const minNrOfItems = Math.max(...[homeFormationPlaces.length, awayFormationPlaces.length]);
    const lines: FormationPlacesLine[] = [];
    for (let i = 0; i < minNrOfItems; i++) {
      lines.push({ home: homeFormationPlaces.shift(), away: awayFormationPlaces.shift() });
    }
    return lines;
  }

  getFormationPlaces(sourceGame: AgainstGame, side: AgainstSide, team: Team): (S11FormationPlace | undefined)[] {
    const editPeriod = this.getCurrentEditPeriod(this.pool);
    const competitor = side === AgainstSide.Home ? this.homeCompetitor : this.awayCompetitor;
    const formation = editPeriod && competitor ? competitor.getPoolUser().getFormation(editPeriod) : undefined;
    if (formation === undefined) {
      return [];
    }
    return formation.getPlaces().filter((formationPlace: S11FormationPlace): boolean => {
      const s11Player = formationPlace.getPlayer();
      if (s11Player === undefined) {
        return false;
      }
      return s11Player.getPlayer(team, sourceGame.getStartDateTime()) !== undefined;
    });
  }

  // getLineClass(prefix: string): string {
  //   return this.cssService.getLine(this.line.getNumber(), prefix + '-');
  // }



  // getPlace(sourceGame: AgainstGame, side: AgainstSide, poolUser: PoolUser): S11Player | undefined {
  //   const editPeriod = this.getCurrentEditPeriod(poolUser.getPool());
  //   const formation = editPeriod ? poolUser.getFormation(editPeriod) : undefined;
  //   const team = this.getTeam(sourceGame.getSidePlaces(side));
  //   return team ? formation?.getPlayer(team, sourceGame.getStartDateTime()) : undefined;
  // }

  // getPlayer(sourceGame: AgainstGame, side: AgainstSide, poolUser: PoolUser): S11Player | undefined {
  //   const editPeriod = this.getCurrentEditPeriod(poolUser.getPool());
  //   const formation = editPeriod ? poolUser.getFormation(editPeriod) : undefined;
  //   const team = this.getTeam(sourceGame.getSidePlaces(side));
  //   return team ? formation?.getPlayer(team, sourceGame.getStartDateTime()) : undefined;
  // }



  protected getTeams(sourceGame: AgainstGame): Team[] {
    return sourceGame.getSidePlaces().map((sideGamePlace: AgainstGamePlace): Team => {
      const startLocation = sideGamePlace.getPlace().getStartLocation();
      if (startLocation === undefined) {
        throw new Error('unknown team');
      }
      const competitor = <TeamCompetitor>this.startLocationMap.getCompetitor(startLocation);
      return competitor.getTeam();
    });
  }

  isToday(date: Date): boolean {
    var today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  getCompetitors(game: AgainstGame, side: AgainstSide): (Competitor | undefined)[] {
    return game.getSidePlaces(side).map((gamePlace: AgainstGamePlace): Competitor | undefined => {
      if (gamePlace === undefined) {
        return undefined;
      }
      const startLocation = gamePlace.getPlace().getStartLocation();
      return startLocation ? this.startLocationMap.getCompetitor(startLocation) : undefined;
    });
  }

  getTeam(sideCompetitor: Competitor | undefined): Team | undefined {
    const teamCompetitor = this.getTeamCompetitor(sideCompetitor);
    return teamCompetitor?.getTeam() ?? undefined;
  }

  getTeamCompetitor(sideCompetitor: Competitor | undefined): TeamCompetitor | undefined {
    if (this.isTeamCompetitor(sideCompetitor)) {
      return <TeamCompetitor>sideCompetitor;
    }
    return undefined;
  }

  navigateBack() {
    this.myNavigation.back();
  }

  navigateToChat(poolPoule: Poule): void {
    this.router.navigate(['/pool/chat', this.pool.getId(), this.leagueName, poolPoule.getId()]);
  }
}

interface FormationPlacesLine {
  home: S11FormationPlace | undefined;
  away: S11FormationPlace | undefined;
}

// type SideMap = Map<AgainstSide, FormationPlacesMap>;
// type FormationPlacesMap = Map<number, S11FormationPlace[]>; 
