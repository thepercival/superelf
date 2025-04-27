import { Component, OnInit, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgainstGame, AgainstSide, Competitor, CompetitorBase, GameState } from 'ngx-sport';
import { DateFormatter } from '../../../../lib/dateFormatter';
import { NgTemplateOutlet } from '@angular/common';
import { SuperElfNameService } from '../../../../lib/nameservice';
import { LineIconComponent } from '../../../../shared/commonmodule/lineicon/lineicon.component';
import { S11Player } from '../../../../lib/player';
import { GameRound } from '../../../../lib/gameRound';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { S11PlayerModalComponent } from '../../../player/playerinfo.modal.component';
import { SportExtensions } from '../../../../lib/sportExtensions';
import { StatisticsGetter } from '../../../../lib/statistics/getter';
import { PoolUserRow } from './againstgames-table.component';
import { RouterLink } from '@angular/router';
import { Statistics } from '../../../../lib/statistics';
import { MinutesAsGradientsService } from '../../../../shared/commonmodule/minutesAsGradientsService';

@Component({
  selector: "tr[s11-game-tablerow]",
  standalone: true,
  imports: [FontAwesomeModule, NgTemplateOutlet, LineIconComponent, RouterLink],
  templateUrl: "./game-tablerow.component.html",
  styleUrls: ["./game-tablerow.component.scss"],
})
export class GameTableRowComponent implements OnInit {
  public readonly gameRound = input.required<GameRound>();
  public readonly sourceAgainstGame = input.required<AgainstGame>();
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
    activeModal.componentInstance.sourceAgainstGame = this.sourceAgainstGame();
    activeModal.componentInstance.scorePointsMap = this.poolUserRow().poolUser.getPool().getCompetitionConfig().getScorePointsMap();
    activeModal.result.then(
      () => {},
      (reason) => {}
    );
  }

  getAppearanceColumnsAsGradient(statistics: Statistics): string {
    return (new MinutesAsGradientsService()).getAppearanceColumnsAsGradient(statistics);
  }
}