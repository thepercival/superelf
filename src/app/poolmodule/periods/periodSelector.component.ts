import { Component, EventEmitter, OnInit, Output, input, model } from '@angular/core';
import { GameRound } from '../../lib/gameRound';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferPeriod } from '../../lib/periods/transferPeriod';

@Component({
  selector: "app-period-selector",
  standalone: true,
  imports: [FontAwesomeModule, NgbProgressbarModule],
  templateUrl: "./periodSelector.component.html",
  styleUrls: ["./periodSelector.component.scss"],
})
export class PeriodSelectorComponent implements OnInit {
  readonly competitionConfig = input.required<CompetitionConfig>();
  readonly activePeriod = model.required<ViewPeriod|TransferPeriod>();
  
  @Output() selectPeriod = new EventEmitter<ViewPeriod|TransferPeriod>();

  // public segments: number[] | undefined;
  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

  constructor() {}

  ngOnInit() {
    
  }

  processSelectPeriod(period: ViewPeriod|TransferPeriod) {
    this.activePeriod.set(period);
    this.selectPeriod.emit(period);
  }

  get AssembleViewPeriod(): ViewPeriod {
    return this.competitionConfig().getAssemblePeriod().getViewPeriod();
  }
  get TransferViewPeriod(): ViewPeriod {
    return this.TransferPeriod.getViewPeriod();
  }
  get TransferPeriod(): TransferPeriod {
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

  // getPercentageCreated(gameRound: GameRound): number {
  //   return Math.floor((gameRound.created / gameRound.totalNrOfGames) * 100);
  // }

  // getPercentageInProgress(gameRound: GameRound): number {
  //   return Math.floor((gameRound.inProgress / gameRound.totalNrOfGames) * 100);
  // }

  // getPercentageFinished(gameRound: GameRound): number {
  //   return Math.floor((gameRound.finished / gameRound.totalNrOfGames) * 100);
  // }
}