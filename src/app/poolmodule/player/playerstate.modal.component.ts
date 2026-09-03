import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgainstGame } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { AgainstGameMissingPlayer } from '../../lib/ngx-sport/game/football';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { AgainstGameTitleComponent } from '../game/source/title.component';
import { S11Player } from '../../lib/player';
import { ScorePointsMap } from '../../lib/score/points';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { S11PlayerModalComponent } from './playerinfo.modal.component';
import { Statistics } from '../../lib/statistics';
import { JsonGameParticipationStatistic } from '../../lib/statistics/json';

@Component({
  selector: 's11-player-state-modal',
  standalone: true,
  imports: [AgainstGameTitleComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './playerstate.modal.component.html'
})
export class PlayerStateModalComponent {
  @Input() s11Player!: S11Player;
  @Input() scorePointsMap!: ScorePointsMap;
  @Input({ required: true }) gameRoundNumber!: number;
  @Input() games: PlayerStateGame[] = [];

  constructor(
    public modal: NgbActiveModal,
    private cssService: CSSService,
    private modalService: NgbModal
  ) {}

  getLineClass(): string {
    return this.cssService.getLine(this.s11Player.getLine());
  }

  formatExpectedEndDate(expectedEndDate: Date | undefined): string {
    return expectedEndDate?.toLocaleDateString('nl-NL') ?? '-';
  }

  getStatistic(statistics: Statistics, name: string): JsonGameParticipationStatistic | undefined {
    for (const category of statistics.getCategories()) {
      const statistic = category.statistics.find(categoryStatistic => categoryStatistic.name === name);
      if (statistic !== undefined) {
        return statistic;
      }
    }
    return undefined;
  }

  formatStatisticValue(statistic: JsonGameParticipationStatistic): string {
    return new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 2 }).format(statistic.value);
  }

  openGame(stateGame: PlayerStateGame): void {
    if (!stateGame.hasAppeared) {
      return;
    }
    this.modal.close();
    const modalRef = this.modalService.open(S11PlayerModalComponent, { scrollable: true });
    modalRef.componentInstance.s11Player = this.s11Player;
    modalRef.componentInstance.sourceAgainstGame = stateGame.game;
    modalRef.componentInstance.scorePointsMap = this.scorePointsMap;
  }
}

export interface PlayerStateGame {
  gameRound: GameRound;
  game: AgainstGame;
  missingPlayer?: AgainstGameMissingPlayer;
  statistics?: Statistics;
  hasAppeared: boolean;
}