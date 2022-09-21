import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Player } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';

@Component({
  selector: 'app-gameround-scroller',
  templateUrl: './gameRoundScroller.component.html',
  styleUrls: ['./gameRoundScroller.component.scss']
})
export class GameRoundScrollerComponent implements OnInit, OnChanges {
  @Input() gameRounds: (GameRound | undefined)[] = [];
  @Input() current: GameRound | undefined;
  @Output() update = new EventEmitter<GameRound | undefined>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('cdk', changes.current, this.gameRounds.slice());
    if (changes.current.firstChange && changes.current.currentValue && this.gameRounds) {
      while (this.current !== this.gameRounds[0]) {
        const gameRound = this.gameRounds.shift();
        if (gameRound !== undefined) {
          this.gameRounds.push(gameRound);
        }
      }
      console.log('cdk2', changes.current.currentValue, this.gameRounds.slice());
    }
  }


  previous(): void {
    console.log('scroller->previous pre', this.gameRounds.slice());
    this.current = this.gameRounds.pop();
    this.gameRounds.unshift(this.current);
    console.log('scroller->previous post', this.gameRounds.slice());
    this.update.emit(this.current);
  }

  next(): void {
    console.log('scroller->next pre', this.gameRounds.slice());
    this.gameRounds.push(this.gameRounds.shift());
    const gameRound = this.gameRounds.shift();
    this.current = gameRound;
    this.gameRounds.unshift(gameRound);
    console.log('scroller->next post', this.gameRounds.slice());
    this.update.emit(this.current);
  }

  getCurrentLabel(): string {
    if (this.current === undefined) {
      return 'alle speelronden';
    }
    return 'speelronde ' + this.current.getNumber();
  }
}
