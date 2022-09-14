import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';

@Component({
  selector: 'app-gameround-scroller',
  templateUrl: './gameRoundScroller.component.html',
  styleUrls: ['./gameRoundScroller.component.scss']
})
export class GameRoundScrollerComponent implements OnInit {
  @Input() gameRounds: (GameRound | undefined)[] = [];
  @Input() current: GameRound | undefined;
  @Output() update = new EventEmitter<GameRound | undefined>();

  constructor() {
  }

  ngOnInit() {

  }

  previous(): void {
    // console.log('scroller->previous pre', this.gameRounds.slice());
    this.current = this.gameRounds.pop();
    this.gameRounds.unshift(this.current);
    // console.log('scroller->previous post', this.gameRounds.slice());
    this.update.emit(this.current);
  }

  next(): void {
    // console.log('scroller->next pre', this.gameRounds.slice());
    this.gameRounds.push(this.gameRounds.shift());
    this.current = this.gameRounds.shift();
    this.gameRounds.unshift(this.current);
    // console.log('scroller->next post', this.gameRounds.slice());
    this.update.emit(this.current);
  }

  getCurrentLabel(): string {
    if (this.current === undefined) {
      return 'alle speelronden';
    }
    return 'speelronde ' + this.current.getNumber();
  }
}
