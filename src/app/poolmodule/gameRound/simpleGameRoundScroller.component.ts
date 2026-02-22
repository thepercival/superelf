import { Component, EventEmitter, OnInit, Output, TemplateRef, effect, inject, input, model } from '@angular/core';
import { GameRound } from '../../lib/gameRound';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "[app-simple-gameround-scroller]",
  standalone: true,
  imports: [FontAwesomeModule, NgbProgressbarModule],
  templateUrl: "./simpleGameRoundScroller.component.html",
  styleUrls: ["./simpleGameRoundScroller.component.scss"],
})
export class SimpleGameRoundScrollerComponent implements OnInit {
  readonly viewPeriod = input.required<ViewPeriod>();
  readonly gameRounds = input.required<GameRound[]>();
  readonly previousGameRound = input.required<GameRound|undefined>();
  readonly nextGameRound = input.required<GameRound|undefined>();
  readonly activeGameRound = input.required<GameRound>();  

  @Output() previousPressed = new EventEmitter();
  @Output() gameRoundPressed = new EventEmitter<GameRound>();
  @Output() nextPressed = new EventEmitter();

  modalService: NgbModal = inject(NgbModal);
  modalGameRound: GameRound | undefined;
  // public segments: number[] | undefined;
  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

  constructor() {
    // effect(() => {
      
    // });
  }

  ngOnInit() {
    // const nrOfCompetitors: number = this.competitionConfig()
    //   .getSourceCompetition()
    //   .getTeamCompetitors().length;
    // const nrOfSegments = Math.floor(nrOfCompetitors / 2);
    // this.segments = Array.from({ length: nrOfSegments }, (_, i) => i + 1);
  }




  // hasPreviousGameRounds(): boolean {
  //   const smallestGameRound: GameRound = this.gameRounds()[0];
  //   return this.activeGameRound().number < smallestGameRound.number;
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
