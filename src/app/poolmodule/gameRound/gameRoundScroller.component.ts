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
  readonly gameRounds = input.required<GameRound[]>();
  readonly current = input.required<GameRound>();
  @Output() selectGameRound = new EventEmitter<GameRound>();
  @Output() selectViewPeriod = new EventEmitter<ViewPeriod>();
  @Output() selectTransferPeriod = new EventEmitter<EditPeriod>();
  public segments: number[] | undefined;
  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

  constructor() {}

  ngOnInit() {
    const nrOfCompetitors: number = this.competitionConfig()
      .getSourceCompetition()
      .getTeamCompetitors().length;
    const nrOfSegments = Math.floor(nrOfCompetitors / 2);
    this.segments = Array.from({ length: nrOfSegments }, (_, i) => i + 1);
  }

  isCurrentBeforeTransferPeriod(): boolean {
    return this.CurrentViewPeriod != this.TransferPeriod.getViewPeriod();
  }

  get CurrentViewPeriod(): ViewPeriod {
    return this.current().viewPeriod;
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

  // ngOnChanges(changes: SimpleChanges) {
  //   // console.log('cdk', changes.current, this.gameRounds.slice());

  //   const gameRounds = this.gameRounds();
  //   if (changes.current && changes.current.firstChange && changes.current.currentValue && gameRounds) {
  //     while (this.current() !== gameRounds[0]) {
  //       const gameRound = gameRounds.shift();
  //       if (gameRound !== undefined) {
  //         gameRounds.push(gameRound);
  //       }
  //     }
  //     // console.log('cdk2', changes.current.currentValue, this.gameRounds.slice());
  //   }
  // }

  // previous(): void {
  //   // console.log('scroller->previous pre', this.gameRounds.slice());
  //   this.current.set(this.gameRounds().pop());
  //   const current = this.current();
  //   this.gameRounds().unshift(current);
  //   // console.log('scroller->previous post', this.gameRounds.slice());
  //   this.update.emit(current);
  // }

  // next(): void {
  //   // console.log('scroller->next pre', this.gameRounds.slice());
  //   const gameRounds = this.gameRounds();
  //   this.gameRounds().push(gameRounds.shift());
  //   const gameRound = gameRounds.shift();
  //   this.current.set(gameRound);
  //   gameRounds.unshift(gameRound);
  //   // console.log('scroller->next post', this.gameRounds.slice());
  //   this.update.emit(this.current());
  // }

  getCurrentLabel(): string {
    const current = this.current();
    if (current === undefined) {
      return "alle speelronden";
    }
    return "speelronde " + current.number;
  }

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
