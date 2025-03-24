import { Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { GameRound } from '../../lib/gameRound';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { EditPeriod } from '../../lib/periods/editPeriod';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { NgbProgressbar, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-gameround-scroller",
  standalone: true,
  imports: [FontAwesomeModule, NgbProgressbarModule],
  templateUrl: "./gameRoundScroller.component.html",
  styleUrls: ["./gameRoundScroller.component.scss"],
})
export class GameRoundScrollerComponent implements OnInit {
  readonly competitionConfig = input.required<CompetitionConfig>();
  readonly viewPeriod = input.required<ViewPeriod>();
  readonly gameRounds = input.required<GameRound[]>();
  readonly previousGameRound = input.required<GameRound | undefined>();
  readonly nextGameRound = input.required<GameRound | undefined>();

  // readonly current = input.required<GameRound>();
  @Output() selectGameRound = new EventEmitter<GameRound>();
  @Output() selectViewPeriod = new EventEmitter<ViewPeriod>();
  @Output() selectTransferPeriod = new EventEmitter<EditPeriod>();

  // public segments: number[] | undefined;
  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

  constructor() {}

  ngOnInit() {
    const nrOfCompetitors: number = this.competitionConfig()
      .getSourceCompetition()
      .getTeamCompetitors().length;
    // const nrOfSegments = Math.floor(nrOfCompetitors / 2);
    // this.segments = Array.from({ length: nrOfSegments }, (_, i) => i + 1);
  }

  isCurrentBeforeTransferPeriod(): boolean {
    return this.CurrentViewPeriod != this.TransferPeriod.getViewPeriod();
  }

  get CurrentViewPeriod(): ViewPeriod | undefined {
    return this.gameRounds()[0]?.viewPeriod ?? undefined;
  }

  get AssembleViewPeriod(): ViewPeriod {
    return this.competitionConfig().getAssemblePeriod().getViewPeriod();
  }
  get TransferViewPeriod(): ViewPeriod {
    return this.TransferPeriod.getViewPeriod();
  }
  get TransferPeriod(): EditPeriod {
    return this.competitionConfig().getTransferPeriod();
  }

  // hasPreviousGameRounds(): boolean {
  //   const firstGameRound = this.firstGameRound();
  //   if (firstGameRound === undefined) {
  //     return false;
  //   }
  //   const smallestGameRound: GameRound = this.gameRounds()[0];
  //   return firstGameRound.number < smallestGameRound.number;
  // }

  // getCurrentLabel(): string {
  //   const current = this.current();
  //   if (current === undefined) {
  //     return "alle speelronden";
  //   }
  //   return "speelronde " + current.number;
  // }

  // inAssembleViewPeriod(): boolean {
  //   return this.assembleViewPeriod()?.isIn() ?? false;
  // }

  // inTransferViewPeriod(): boolean {
  //   return this.transferViewPeriod()?.isIn() ?? false;
  // }

  getPercentageCreated(gameRound: GameRound): number {
    return Math.floor((gameRound.created / gameRound.totalNrOfGames) * 100);
  }

  getPercentageInProgress(gameRound: GameRound): number {
    return Math.floor((gameRound.inProgress / gameRound.totalNrOfGames) * 100);
  }

  getPercentageFinished(gameRound: GameRound): number {
    return Math.floor((gameRound.finished / gameRound.totalNrOfGames) * 100);
  }
}
