import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgainstGame, GameState } from 'ngx-sport';

@Component({
  selector: 'app-game-scroller',
  templateUrl: './gameScroller.component.html',
  styleUrls: ['./gameScroller.component.scss']
})
export class GameScrollerComponent implements OnInit {
  @Input() games: AgainstGame[] = [];
  @Input() current!: AgainstGame;
  @Output() update = new EventEmitter<AgainstGame>();
  @Output() navigate = new EventEmitter<AgainstGame>();

  constructor() {
  }

  ngOnInit() {
    this.games.slice().every((game: AgainstGame): boolean => {
      if( game.getState() !== GameState.Finished ) {
        return false;
      }
      this.games.shift()
      this.games.push(game);
      return true;
    });
  }

  previous(): void {
    //console.log('gamescroller->previous pre', this.games.slice());
    const current = this.games.pop();
    if (current) {
      this.current = current;
      this.games.unshift(this.current);
      //console.log('gamescroller->previous post', this.games.slice());
      this.update.emit(this.current);
    }
  }

  next(): void {
    //console.log('gamescroller->next pre', this.games.slice());
    const old = this.games.shift();
    if (old) {
      this.games.push(old);
    }

    const current = this.games.shift();
    if (current) {
      this.games.unshift(current);
      this.current = current;
      //console.log('gamescroller->next post', this.games.slice());
      this.update.emit(this.current);
    }
  }
}
