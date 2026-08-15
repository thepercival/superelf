import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgainstGame, FootballLine } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { AgainstGameMissingPlayer } from '../../lib/ngx-sport/game/football';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { AgainstGameTitleComponent } from '../game/source/title.component';

@Component({
  selector: 's11-missing-player-history',
  standalone: true,
  imports: [AgainstGameTitleComponent],
  templateUrl: './missingplayerhistory.modal.component.html'
})
export class MissingPlayerHistoryModalComponent {
  @Input() playerName = '';
  @Input() playerLine!: FootballLine;
  @Input() currentGameRoundNumber!: number;
  @Input() games: MissingPlayerHistoryGame[] = [];

  constructor(
    public modal: NgbActiveModal,
    private cssService: CSSService
  ) {}

  getLineClass(): string {
    return this.cssService.getLine(this.playerLine);
  }

  formatExpectedEndDate(expectedEndDate: Date | undefined): string {
    return expectedEndDate?.toLocaleDateString('nl-NL') ?? '-';
  }
}

export interface MissingPlayerHistoryGame {
  gameRound: GameRound;
  game: AgainstGame;
  missingPlayer?: AgainstGameMissingPlayer;
}