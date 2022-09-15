import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competition, Competitor, CompetitorBase, StartLocationMap, Structure, Team, TeamCompetitor } from 'ngx-sport';
import { Observable } from 'rxjs';
import { S11Formation } from '../../../../lib/formation';
import { GameRound } from '../../../../lib/gameRound';
import { ImageRepository } from '../../../../lib/image/repository';
import { GameRepository } from '../../../../lib/ngx-sport/game/repository';
import { PlayerRepository } from '../../../../lib/ngx-sport/player/repository';
import { StructureRepository } from '../../../../lib/ngx-sport/structure/repository';
import { S11Player } from '../../../../lib/player';
import { Pool } from '../../../../lib/pool';
import { PoolRepository } from '../../../../lib/pool/repository';
import { PoolUser } from '../../../../lib/pool/user';
import { PoolUserRepository } from '../../../../lib/pool/user/repository';
import { StatisticsRepository } from '../../../../lib/statistics/repository';
import { CSSService } from '../../../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../../../shared/commonmodule/navigation';
import { PoolComponent } from '../../../../shared/poolmodule/component';

@Component({
  selector: 'app-pool-togethergame',
  templateUrl: './togethergame.component.html',
  styleUrls: ['./togethergame.component.scss']
})
export class PoolTogetherGameComponent extends PoolComponent implements OnInit {
  public sourceGame: AgainstGame | undefined;
  private startLocationMap!: StartLocationMap;

  public processing = true;
  public processingPoolUsers = true;
  public poolUsers: PoolUser[] = [];

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


      this.route.params.subscribe(params => {

        this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
          next: (structure: Structure) => {
            const poule = structure.getSingleCategory().getRootRound().getFirstPoule();

            const gameRound = this.getGameRoundByNumber(+params['gameRound']);

            this.gameRepository.getSourceObjects(poule, gameRound).subscribe({
              next: (games: AgainstGame[]) => {
                const game = games.find((game: AgainstGame) => game.getId() === +params['gameId']);
                if (game) {
                  const competitors = game.getPoule().getCompetition().getTeamCompetitors();
                  this.startLocationMap = new StartLocationMap(competitors);
                }
                this.sourceGame = game;
              },
              complete: () => this.processing = false
            });
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

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
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
