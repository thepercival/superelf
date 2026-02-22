import { Component, OnInit, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgainstGame, AgainstSide, GameState } from 'ngx-sport';
import { DateFormatter } from '../../../../lib/dateFormatter';
import { SuperElfNameService } from '../../../../lib/nameservice';
import { GameRound } from '../../../../lib/gameRound';
import { SportExtensions } from '../../../../lib/sportExtensions';
import { GameTableHeaderComponent } from './game-tableheader.component';
import { GameTableRowComponent } from './game-tablerow.component';

@Component({
  selector: "againstgames-table-simple",
  standalone: true,
  imports: [FontAwesomeModule, GameTableHeaderComponent],
  templateUrl: "./againstgames-table-simple.component.html",
  styleUrls: ["./againstgames-table-simple.component.scss"],
})
export class AgainstGamesTableSimpleComponent implements OnInit {
  public sourceAgainstGames = input.required<AgainstGame[]>();
  public gameRound = input.required<GameRound>();
  // public statisticsGetter = input.required<StatisticsGetter>();
  // public readonly competitorPoolUserAndFormations =
  //   input.required<CompetitorPoolUserAndFormation[]>();

    // @let poolUserRows = createPoolUserRows(againstGame, competitorPoolUserAndFormations());

  // private formationPlacesGetter = new FormationPlacesGetter();

  constructor(
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

  // public createPoolUserRows(
  //   againstGame: AgainstGame,
  //   competitorPoolUserAndFormations: CompetitorPoolUserAndFormation[]
  // ): PoolUserRow[] {
  //   const poolUserRows: PoolUserRow[] = [];
  //   for (const competitorPoolUserAndFormation of competitorPoolUserAndFormations) {
  //     const homeFormationPlaces = this.formationPlacesGetter.getFormationPlaces(
  //       againstGame,
  //       AgainstSide.Home,
  //       competitorPoolUserAndFormation
  //     ).slice();
  //     const awayFormationPlaces = this.formationPlacesGetter.getFormationPlaces(
  //       againstGame,
  //       AgainstSide.Away,
  //       competitorPoolUserAndFormation
  //     ).slice();
  //     while (homeFormationPlaces.length > 0 || awayFormationPlaces.length > 0) {
  //       const homeFormationPlace = homeFormationPlaces.pop();
  //       const awayFormationPlace = awayFormationPlaces.pop();

  //       poolUserRows.push({
  //         poolUser: competitorPoolUserAndFormation.poolUser,
  //         homeFormationPlace: homeFormationPlace,
  //         awayFormationPlace: awayFormationPlace,
  //       });
  //     }      
  //   }
  //   return poolUserRows;
  // }
}

// export interface PoolUserRow {
//   poolUser: PoolUser;
//   homeFormationPlace: S11FormationPlace | undefined;
//   awayFormationPlace: S11FormationPlace | undefined;
// }