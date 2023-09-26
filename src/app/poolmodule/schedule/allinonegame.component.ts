import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competition, Competitor, CompetitorBase, GameState, Place, Poule, SportRoundRankingItem, StartLocationMap, Structure, StructureNameService, Team, TeamCompetitor, TogetherGame, TogetherSportRoundRankingCalculator } from 'ngx-sport';
import { Observable } from 'rxjs';
import { AuthService } from '../../lib/auth/auth.service';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { S11Formation } from '../../lib/formation';
import { S11FormationPlace } from '../../lib/formation/place';
import { FormationRepository } from '../../lib/formation/repository';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { LeagueName } from '../../lib/leagueName';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { Pool } from '../../lib/pool';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { S11Player } from '../../lib/player';


@Component({
  selector: 'app-pool-allinonegame-schedule',
  templateUrl: './allinonegame.component.html',
  styleUrls: ['./allinonegame.component.scss']
})
export class PoolAllInOneGameScheduleComponent extends PoolComponent implements OnInit {
  public gameRounds: GameRound[] = [];
  public currentGameRound: GameRound | undefined;
  public sourceGameRoundGames: AgainstGame[] = [];
  public currentSourceGame: AgainstGame | undefined;
  private startLocationMap!: StartLocationMap;
  private sourceStartLocationMap!: StartLocationMap;
  public formationMap: Map<number,S11Formation>|undefined;

  public poule: Poule | undefined;
  public structureNameService!: StructureNameService;
  public leagueName!: LeagueName;
  public nrOfUnreadMessages = 0;

  public processing = true;
  public processingPoolUsers = true;
  public processingGames = true;
  // public poolUsers: PoolUser[] = [];
  public sportRankingItems!: SportRoundRankingItem[];
  private sourceStructure!: Structure;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private formationRepository: FormationRepository,
    private poolUserRepository: PoolUserRepository,
    private structureRepository: StructureRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    protected chatMessageRepository: ChatMessageRepository,
    public cssService: CSSService,
    private authService: AuthService,
    private myNavigation: MyNavigation) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);
      this.setLeagueName(pool.getCompetitions());
      const user = this.authService.getUser();
      this.poolUserRepository.getObjects(pool).subscribe((poolUsers: PoolUser[]) => {
        // this.poolUsers = poolUsers;
        this.poolUserFromSession = poolUsers.find((poolUser: PoolUser) => poolUser.getUser() === user);
        const competition = this.pool.getCompetition(this.leagueName);
        if (competition === undefined) {
          this.processing = false;
          throw Error('competitionSport not found');
        }

        const editPeriod = this.getMostRecentEndedEditPeriod(this.pool);
        if (editPeriod === undefined) {
          this.processing = false;
          throw Error('geen competitie periode gevonden');
        }
        this.formationRepository.getObjectMap(this.pool, editPeriod).subscribe({
          next: (formationMap: S11FormationMap) => {
            this.formationMap = formationMap;
            this.structureRepository.getObject(competition).subscribe({
              next: (structure: Structure) => {
    
                const poolCompetitors = this.pool.getCompetitors(this.leagueName);
                const round = structure.getSingleCategory().getRootRound();
                const poule = round.getFirstPoule();
                this.poule = poule;
                const competitionSport = this.pool.getCompetitionSport(this.leagueName);
                this.startLocationMap = new StartLocationMap(poolCompetitors);
                this.structureNameService = new StructureNameService(this.startLocationMap);
                const togetherRankingCalculator = new TogetherSportRoundRankingCalculator(competitionSport, [GameState.InProgress, GameState.Finished]);
                this.sportRankingItems = togetherRankingCalculator.getItemsForPoule(poule);
    
                this.gameRounds = this.getCurrentViewPeriod(pool).getGameRounds();
    
                this.route.params.subscribe(params => {
    
                  this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
                    next: (structure: Structure) => {
                      this.sourceStructure = structure;
    
                      const gameRoundNumber = this.getCurrentSourceGameRoundNumber(poule);
                      const gameRoundFromUrl = this.getGameRoundByNumber(gameRoundNumber);
                      this.updateGameRound(gameRoundFromUrl, undefined);
                    }
                  });
    
                });
    
                if (this.poolUserFromSession && this.poule) {
                  this.chatMessageRepository.getNrOfUnreadObjects(this.poule.getId(), pool).subscribe({
                    next: (nrOfUnreadMessages: number) => {
                      this.nrOfUnreadMessages = nrOfUnreadMessages;
                    }
                  });
                }
              },
              error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
            });            
          },
          error: (e) => {
            this.setAlert('danger', e); this.processing = false;
          }
        });
      });
    });
  }

  setLeagueName(competitions: Competition[]): void {
    const hasWorldCup = competitions.some((competition: Competition): boolean => {
      return competition.getLeague().getName() === LeagueName.WorldCup;
    });
    this.leagueName = hasWorldCup ? LeagueName.WorldCup : LeagueName.Competition;
  }

  get WorldCupLeagueName(): LeagueName { return LeagueName.WorldCup; }
  get Schedule(): NavBarItem { return NavBarItem.Schedule }
  
  getCurrentSourceGameRoundNumber(poule: Poule): number {
    
    const firstInPogress = poule.getTogetherGames().find((game: TogetherGame) => game.getState() === GameState.InProgress);
    let grInProgress = undefined;
    if (firstInPogress !== undefined) {
      grInProgress = firstInPogress.getTogetherPlaces()[0].getGameRoundNumber();
    }

    const lastFinished = poule.getTogetherGames().slice().reverse().find((game: TogetherGame) => game.getState() === GameState.Finished);
    let grLastFinished = undefined;
    if (lastFinished !== undefined) {
      grLastFinished = lastFinished.getTogetherPlaces()[0].getGameRoundNumber();
    }
    const firstCreated = poule.getTogetherGames().find((game: TogetherGame) => game.getState() === GameState.Created);
    let grFirstCreated = undefined;
    if( firstCreated !== undefined) {
      grFirstCreated = firstCreated.getTogetherPlaces()[0].getGameRoundNumber();
    }

    if (grInProgress !== undefined ) {
      if( grLastFinished === undefined || grInProgress > grLastFinished ) {
        return grInProgress;
      }
    }
    if (grLastFinished !== undefined) {
      return grLastFinished;
    }
    if (grFirstCreated !== undefined) {
      return grFirstCreated;
    }
    throw new Error('should be a gameroundnumber');
  }

  get HomeSide(): AgainstSide { return AgainstSide.Home; }
  get AwaySide(): AgainstSide { return AgainstSide.Away; }

  getSourceStructure(competition: Competition): Observable<Structure> {
    // if (this.sourceStructure !== undefined) {
    //   return of(this.sourceStructure);
    // }
    return this.structureRepository.getObject(competition);
  }

  getDefaultGame(games: AgainstGame[]): AgainstGame {
    let game = games.find((game: AgainstGame) => game.getState() === GameState.Created);
    if (game !== undefined) {
      return game;
    }
    game = games.reverse()[0];
    if (game !== undefined) {
      return game;
    }
    throw new Error('no games could be found');
  }

  getGameRoundByNumber(gameRoundNumber: number): GameRound {
    const gameRound = this.gameRounds.find((gameRound: GameRound) => gameRound.getNumber() === gameRoundNumber);

    if (gameRound !== undefined) {
      return gameRound;
    }
    throw new Error('gameRound could not be found for number "' + gameRoundNumber + '"');
  }

  updateGameRound(gameRound: GameRound | undefined, gameId?: number | undefined): void {
    if (gameRound === undefined) {
      return;
    }

    this.processingGames = true;

    this.currentGameRound = gameRound;
    const poule = this.sourceStructure.getSingleCategory().getRootRound().getFirstPoule();

    if (gameRound.hasAgainstGames()) {
      this.updateSourceGame(this.getDefaultGame(gameRound.getAgainstGames()))
      this.processing = false;
      this.processingGames = false;
      return;
    }

    this.gameRepository.getSourceObjects(poule, this.currentGameRound).subscribe({
      next: (games: AgainstGame[]) => {
        this.sourceGameRoundGames = games;
        let game = games.find((game: AgainstGame) => game.getId() === gameId);
        if (game == undefined) {
          game = this.getDefaultGame(games);
        }
        const competitors = game.getPoule().getCompetition().getTeamCompetitors();
        this.sourceStartLocationMap = new StartLocationMap(competitors);
        this.updateSourceGame(game)
      },
      complete: () => {
        this.processing = false; this.processingGames = false;
      }
    });
  }

  updateSourceGame(sourceGame: AgainstGame): void {
    this.currentSourceGame = sourceGame;
  }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }
  
  public getFormationPlaces(sourceGame: AgainstGame, side: AgainstSide, formationMap: S11FormationMap, sportRankingItem: SportRoundRankingItem): S11FormationPlace[] {
    const poolUser = this.getPoolUser(sportRankingItem);
    if( poolUser === undefined) {
      return [];
    }
    const formation = formationMap.get(+poolUser.getId());
    const team = this.getTeam(sourceGame.getSidePlaces(side));
    if (formation === undefined || team === undefined) {
      return [];
    }
    return formation.getPlaces().filter((formationPlace: S11FormationPlace): boolean => {
      return formationPlace.getPlayer()?.getPlayer(team) !== undefined;
    });
  }


  protected getTeam(sideGamePlaces: AgainstGamePlace[]): Team | undefined {
    const teams = sideGamePlaces.map((againstGamePlace: AgainstGamePlace): Team | undefined => {
      const startLocation = againstGamePlace.getPlace().getStartLocation();
      if (startLocation === undefined) {
        return undefined;
      }
      const competitor = <TeamCompetitor>this.sourceStartLocationMap.getCompetitor(startLocation);
      return competitor?.getTeam();
    });
    return teams.find((team: Team | undefined): boolean => team !== undefined);
  }

  getPoolUser(sportRankingItem: SportRoundRankingItem): PoolUser {
    // console.log(sportRankingItem, this.startLocationMap);
    const startLocation = sportRankingItem.getPerformance().getPlace().getStartLocation();
    if (startLocation === undefined) {
      throw new Error('could not find pooluser');
    }
    const competitor = <PoolCompetitor>this.startLocationMap.getCompetitor(startLocation);
    const poolUser = competitor?.getPoolUser();
    if (poolUser === undefined) {
      throw new Error('could not find pooluser');
    }
    return poolUser;
  }

  navigateToSourceGame(game: AgainstGame): void {
    this.router.navigate(['/pool/sourcegame', this.pool.getId(), game.getGameRoundNumber(), game.getId()]);
  }

  navigateToChat(poolPoule: Poule): void {
    this.router.navigate(['/pool/chat', this.pool.getId(), this.leagueName, poolPoule.getId()]);
  }

  linkToPlayer(s11Player: S11Player): void {
    const gameRound = this.currentGameRound?.getNumber() ?? 0;
    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), gameRound]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }

  navigateBack() {
    this.myNavigation.back();
  }

  getRouterLink(sportRankingItem: SportRoundRankingItem, gameRound: GameRound | undefined): (string | number)[] {
    const poolUser = this.getPoolUser(sportRankingItem);
    if (poolUser == undefined) {
      throw new Error('could not find pooluser');
    }

    return ['/pool/user', poolUser.getPool().getId(), poolUser.getId(), gameRound ? gameRound.getNumber() : 0];
  }
}

export interface S11FormationMap extends Map<number,S11Formation>{};