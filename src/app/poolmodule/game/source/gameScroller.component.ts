import { Component, EventEmitter, OnInit, Output, input, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgainstGame, GameState } from 'ngx-sport';
import { AgainstGameTitleComponent } from './title.component';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game-scroller',
  standalone: true,
  imports: [FontAwesomeModule,AgainstGameTitleComponent],
  templateUrl: './gameScroller.component.html',
  styleUrls: ['./gameScroller.component.scss']
})
export class GameScrollerComponent implements OnInit {
  readonly games = input<AgainstGame[]>([]);
  readonly current = model.required<AgainstGame>();
  @Output() update = new EventEmitter<AgainstGame>();
  @Output() navigate = new EventEmitter<AgainstGame>();
  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

  constructor() {
  }

  ngOnInit() {
    this.games().slice().every((game: AgainstGame): boolean => {
      if( game.getState() !== GameState.Finished ) {
        return false;
      }
      this.games().shift()
      this.games().push(game);
      return true;
    });
  }

  previous(): void {
    //console.log('gamescroller->previous pre', this.games.slice());
    const current = this.games().pop();
    if (current) {
      this.current.set(current);
      const currentValue = this.current();
      this.games().unshift(currentValue);
      //console.log('gamescroller->previous post', this.games.slice());
      this.update.emit(currentValue);
    }
  }

  next(): void {
    //console.log('gamescroller->next pre', this.games.slice());
    const old = this.games().shift();
    if (old) {
      this.games().push(old);
    }

    const current = this.games().shift();
    if (current) {
      this.games().unshift(current);
      this.current.set(current);
      //console.log('gamescroller->next post', this.games.slice());
      this.update.emit(this.current());
    }
  }
}
