import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, input, model } from '@angular/core';
import { GameRound } from '../../lib/gameRound';
import { ViewPeriod } from '../../lib/period/view';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-gameround-scroller',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './gameRoundScroller.component.html',
  styleUrls: ['./gameRoundScroller.component.scss']
})
export class GameRoundScrollerComponent implements OnInit, OnChanges {

  readonly assembleViewPeriod = input<ViewPeriod>();
  readonly transferViewPeriod = input<ViewPeriod>();
  readonly currentViewPeriod = input.required<ViewPeriod>();
  readonly gameRounds = input<(GameRound | undefined)[]>([]);
  readonly current = model<GameRound>();
  @Output() update = new EventEmitter<GameRound | undefined>();
  @Output() updateViewPeriod = new EventEmitter<ViewPeriod>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('cdk', changes.current, this.gameRounds.slice());
    
    const gameRounds = this.gameRounds();
    if (changes.current && changes.current.firstChange && changes.current.currentValue && gameRounds) {
      while (this.current() !== gameRounds[0]) {
        const gameRound = gameRounds.shift();
        if (gameRound !== undefined) {
          gameRounds.push(gameRound);
        }
      }
      // console.log('cdk2', changes.current.currentValue, this.gameRounds.slice());
    }
  }


  previous(): void {
    // console.log('scroller->previous pre', this.gameRounds.slice());
    this.current.set(this.gameRounds().pop());
    const current = this.current();
    this.gameRounds().unshift(current);
    // console.log('scroller->previous post', this.gameRounds.slice());
    this.update.emit(current);
  }

  next(): void {
    // console.log('scroller->next pre', this.gameRounds.slice());
    const gameRounds = this.gameRounds();
    this.gameRounds().push(gameRounds.shift());
    const gameRound = gameRounds.shift();
    this.current.set(gameRound);
    gameRounds.unshift(gameRound);
    // console.log('scroller->next post', this.gameRounds.slice());
    this.update.emit(this.current());
  }

  getCurrentLabel(): string {
    const current = this.current();
    if (current === undefined) {
      return 'alle speelronden';
    }
    return 'speelronde ' + current.getNumber();
  }

  
  inAssembleViewPeriod(): boolean {
    return this.assembleViewPeriod()?.isIn() ?? false;
  }
  
  
  inTransferViewPeriod(): boolean {
    return this.transferViewPeriod()?.isIn() ?? false;
  }
}
