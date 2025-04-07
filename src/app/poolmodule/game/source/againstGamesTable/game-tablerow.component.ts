import { Component, EventEmitter, OnInit, Output, input, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, CompetitorBase, GameState, NameService, SportRoundRankingItem, StartLocation, StartLocationMap, StructureNameService, Team, TeamCompetitor } from 'ngx-sport';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { DateFormatter } from '../../../../lib/dateFormatter';
import { TeamNameComponent } from '../../../team/name.component';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { SuperElfNameService } from '../../../../lib/nameservice';
import { LineIconComponent } from '../../../../shared/commonmodule/lineicon/lineicon.component';
import { S11FormationPlace } from '../../../../lib/formation/place';
import { S11Player } from '../../../../lib/player';
import { Pool } from '../../../../lib/pool';
import { S11FormationMap } from '../../../allinonegame/allinonegame.component';
import { GameRound } from '../../../../lib/gameRound';
import { PoolCompetitor } from '../../../../lib/pool/competitor';
import { PoolUser } from '../../../../lib/pool/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { S11PlayerModalComponent } from '../../../player/info.modal.component';
import { SportExtensions } from '../../../../lib/sportExtensions';
import { CompetitionConfig } from '../../../../lib/competitionConfig';
import { ActiveViewGameRoundsCalculator } from '../../../../lib/gameRound/activeViewGameRoundsCalculator';
import { CompetitorWithGameRoundsPoints } from '../../../../lib/views/togetherRankingView/competitorWithGameRoundsPoints';
import { StatisticsGetter } from '../../../../lib/statistics/getter';
import { CompetitorPoolUserAndFormation } from '../../../poule/againstgames.component';
import { PoolUserRow } from './againstgames-table.component';

@Component({
  selector: "tr[s11-game-tablerow]",
  standalone: true,
  imports: [FontAwesomeModule, NgTemplateOutlet, LineIconComponent],
  templateUrl: "./game-tablerow.component.html",
  styleUrls: ["./game-tablerow.component.scss"],
})
export class GameTableRowComponent implements OnInit {
  public readonly gameRound = input.required<GameRound>();
  public readonly poolUserRow = input.required<PoolUserRow>();

  public readonly statisticsGetter = input.required<StatisticsGetter>();

  // kleurtje bij de speler wanneer deze goed scoort

  constructor(
    private modalService: NgbModal,
    public sportExtensions: SportExtensions,
    public dateFormatter: DateFormatter,
    public s11NameService: SuperElfNameService
  ) {}

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



  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }





  // maak hier een modal van
  openPlayerModal(s11Player: S11Player): void {
    const activeModal = this.modalService.open(S11PlayerModalComponent);
    activeModal.componentInstance.s11Player = s11Player;
    activeModal.componentInstance.currentGameRound = this.gameRound();
    activeModal.result.then(
      () => {},
      (reason) => {}
    );

    // const gameRound = this.currentGameRound?.getNumber() ?? 0;
    // this.router.navigate(
    //   ["/pool/player/", pool.getId(), s11Player.getId(), gameRound] , {
    //   state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    // }
    // );
  }

  getRouterLink(
    poolUser: PoolUser,
    gameRound: GameRound | undefined
  ): (string | number)[] {
    return [
      "/pool/user",
      poolUser.getPool().getId(),
      poolUser.getId(),
      this.gameRound().number,
    ];
  }
}

