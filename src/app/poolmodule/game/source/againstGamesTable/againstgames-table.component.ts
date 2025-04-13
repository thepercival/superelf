import { Component, EventEmitter, OnInit, Output, WritableSignal, model, input, effect } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, CompetitorBase, GameState, NameService, SportRoundRankingItem, StartLocation, StartLocationMap, StructureNameService, Team, TeamCompetitor } from 'ngx-sport';
import { DateFormatter } from '../../../../lib/dateFormatter';
import { SuperElfNameService } from '../../../../lib/nameservice';
import { GameRound } from '../../../../lib/gameRound';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SportExtensions } from '../../../../lib/sportExtensions';
import { GameTableHeaderComponent } from './game-tableheader.component';
import { CompetitorPoolUserAndFormation } from '../../../poule/againstgames.component';
import { GameTableRowComponent } from './game-tablerow.component';
import { StatisticsGetter } from '../../../../lib/statistics/getter';
import { PoolUser } from '../../../../lib/pool/user';
import { S11Player } from '../../../../lib/player';
import { S11FormationPlace } from '../../../../lib/formation/place';
import { FormationPlacesGetter } from './formationPlacesGetter';

@Component({
  selector: "againstgames-table",
  standalone: true,
  imports: [FontAwesomeModule, GameTableHeaderComponent, GameTableRowComponent],
  templateUrl: "./againstgames-table.component.html",
  styleUrls: ["./againstgames-table.component.scss"],
})
export class AgainstGamesTableComponent implements OnInit {
  public sourceAgainstGames = input.required<AgainstGame[]>();
  public gameRound = input.required<GameRound>();
  public statisticsGetter = input.required<StatisticsGetter>();
  public readonly competitorPoolUserAndFormations =
    input.required<CompetitorPoolUserAndFormation[]>();

  private formationPlacesGetter = new FormationPlacesGetter();

  constructor(
    private modalService: NgbModal,
    public sportExtensions: SportExtensions,
    public dateFormatter: DateFormatter,
    public s11NameService: SuperElfNameService
  ) {
    
  }

  get Finished(): GameState {
    return GameState.Finished;
  }
  get HomeSide(): AgainstSide {
    return AgainstSide.Home;
  }
  get AwaySide(): AgainstSide {
    return AgainstSide.Away;
  }

  ngOnInit() {
    // this.games().slice().every((game: AgainstGame): boolean => {
    //   if( game.getState() !== GameState.Finished ) {
    //     return false;
    //   }
    //   this.games().shift()
    //   this.games().push(game);
    //   return true;
    // });        
  }

  public createPoolUserRows(
    againstGame: AgainstGame,
    competitorPoolUserAndFormations: CompetitorPoolUserAndFormation[]
  ): PoolUserRow[] {
    const poolUserRows: PoolUserRow[] = [];
    for (const competitorPoolUserAndFormation of competitorPoolUserAndFormations) {
      const homeFormationPlaces = this.formationPlacesGetter.getFormationPlaces(
        againstGame,
        AgainstSide.Home,
        competitorPoolUserAndFormation
      ).slice();
      const awayFormationPlaces = this.formationPlacesGetter.getFormationPlaces(
        againstGame,
        AgainstSide.Away,
        competitorPoolUserAndFormation
      ).slice();
      while (homeFormationPlaces.length > 0 || awayFormationPlaces.length > 0) {
        const homeFormationPlace = homeFormationPlaces.pop();
        const awayFormationPlace = awayFormationPlaces.pop();

        poolUserRows.push({
          poolUser: competitorPoolUserAndFormation.poolUser,
          homeFormationPlace: homeFormationPlace,
          awayFormationPlace: awayFormationPlace,
        });
      }      
    }
    return poolUserRows;
  }
}

export interface PoolUserRow {
  poolUser: PoolUser;
  homeFormationPlace: S11FormationPlace | undefined;
  awayFormationPlace: S11FormationPlace | undefined;
}