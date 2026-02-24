import { Component, EventEmitter, OnInit, Output, TemplateRef, effect, inject, input, model } from '@angular/core';
import { GameRound } from '../../lib/gameRound';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { GameState } from 'ngx-sport';

@Component({
  selector: "app-schedule-gameround-scroller",
  standalone: true,
  imports: [FontAwesomeModule, NgbProgressbarModule],
  templateUrl: "./scheduleGameRoundScroller.component.html",
  styleUrls: ["./scheduleGameRoundScroller.component.scss"],
})
export class ScheduleGameRoundScrollerComponent implements OnInit {
  readonly viewPeriod = input.required<ViewPeriod>();
  readonly gameRounds = input.required<GameRound[]>();
  readonly previousGameRound = input.required<GameRound|undefined>();
  readonly nextGameRound = input.required<GameRound|undefined>();
  readonly activeGameRound = input.required<GameRound>();  

  @Output() previousPressed = new EventEmitter();
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

  public getGameRoundProgressColumns(gameRound: GameRound): GameRoundProgressColumn[] {
    const columnsDelta: GameRoundProgressColumn[] = [];

    const finished = Math.floor((gameRound.finished / gameRound.totalNrOfGames) * 100);
    columnsDelta.push({
        gameState: GameState.Finished,
        percentage: finished
    });
    columnsDelta.push({
        gameState: GameState.Created,
        percentage: 100 - finished
    });
    return columnsDelta;
  }

  get GameStateFinished(): GameState {
    return GameState.Finished;
  }
}

export interface GameRoundProgressColumn { 
  gameState: GameState
  percentage: number
}