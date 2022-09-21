import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competition, Competitor, CompetitorBase, GameState, StartLocationMap, Structure, Team, TeamCompetitor } from 'ngx-sport';
import { Observable } from 'rxjs';
import { S11FormationPlace } from '../../../lib/formation/place';
import { GameRound } from '../../../lib/gameRound';
import { ImageRepository } from '../../../lib/image/repository';
import { GameRepository } from '../../../lib/ngx-sport/game/repository';
import { PlayerRepository } from '../../../lib/ngx-sport/player/repository';
import { StructureRepository } from '../../../lib/ngx-sport/structure/repository';
import { S11Player } from '../../../lib/player';
import { Pool } from '../../../lib/pool';
import { PoolRepository } from '../../../lib/pool/repository';
import { PoolUser } from '../../../lib/pool/user';
import { PoolUserRepository } from '../../../lib/pool/user/repository';
import { CSSService } from '../../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../../shared/commonmodule/navigation';
import { PoolComponent } from '../../../shared/poolmodule/component';


@Component({
  selector: 'app-pool-togethergame',
  templateUrl: './togethergame.component.html',
  styleUrls: ['./togethergame.component.scss']
})
export class PoolTogetherGameComponent extends PoolComponent implements OnInit {
  public gameRounds: GameRound[] = [];
  public currentGameRound: GameRound | undefined;
  public sourceGameRoundGames: AgainstGame[] = [];
  public currentSourceGame: AgainstGame | undefined;
  private startLocationMap!: StartLocationMap;

  public processing = true;
  public processingPoolUsers = true;
  public processingGames = true;
  public poolUsers: PoolUser[] = [];
  private sourceStructure!: Structure;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private playerRepository: PlayerRepository,
    private poolUserRepository: PoolUserRepository,
    private structureRepository: StructureRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    private myNavigation: MyNavigation) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);

      this.poolUserRepository.getObjects(pool).subscribe((poolUsers: PoolUser[]) => {
        this.poolUsers = poolUsers;
      });

      this.gameRounds = this.getCurrentViewPeriod(pool).getGameRounds();

      this.route.params.subscribe(params => {

        this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
          next: (structure: Structure) => {
            this.sourceStructure = structure;

            const gameRoundFromUrl = this.getGameRoundByNumber(+params['gameRound']);
            this.updateGameRound(gameRoundFromUrl, +params['gameId']);
          }
        });

      });
    });
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
    console.log(123);
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
        this.startLocationMap = new StartLocationMap(competitors);
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

  getFormationPlaces(sourceGame: AgainstGame, side: AgainstSide, poolUser: PoolUser): S11FormationPlace[] {
    const editPeriod = this.getCurrentEditPeriod(poolUser.getPool());
    const formation = editPeriod ? poolUser.getFormation(editPeriod) : undefined;
    const team = this.getTeam(sourceGame.getSidePlaces(side));
    if (formation === undefined || team === undefined) {
      return [];
    }
    return formation.getPlaces().filter((formationPlace: S11FormationPlace): boolean => {
      return formationPlace.getPlayer()?.getPlayer(team) !== undefined;
    });
  }
  getPlace(sourceGame: AgainstGame, side: AgainstSide, poolUser: PoolUser): S11Player | undefined {
    const editPeriod = this.getCurrentEditPeriod(poolUser.getPool());
    const formation = editPeriod ? poolUser.getFormation(editPeriod) : undefined;
    const team = this.getTeam(sourceGame.getSidePlaces(side));
    return team ? formation?.getPlayer(team, sourceGame.getStartDateTime()) : undefined;
  }

  getPlayer(sourceGame: AgainstGame, side: AgainstSide, poolUser: PoolUser): S11Player | undefined {
    const editPeriod = this.getCurrentEditPeriod(poolUser.getPool());
    const formation = editPeriod ? poolUser.getFormation(editPeriod) : undefined;
    const team = this.getTeam(sourceGame.getSidePlaces(side));
    return team ? formation?.getPlayer(team, sourceGame.getStartDateTime()) : undefined;
  }

  protected getTeam(sideGamePlaces: AgainstGamePlace[]): Team | undefined {
    const teams = sideGamePlaces.map((againstGamePlace: AgainstGamePlace): Team | undefined => {
      const startLocation = againstGamePlace.getPlace().getStartLocation();
      if (startLocation === undefined) {
        return undefined;
      }
      const competitor = <TeamCompetitor>this.startLocationMap.getCompetitor(startLocation);
      return competitor?.getTeam();
    });
    return teams.find((team: Team | undefined): boolean => team !== undefined);
  }

  navigateBack() {
    this.myNavigation.back();
  }
}
