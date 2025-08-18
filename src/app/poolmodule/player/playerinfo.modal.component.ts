import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AgainstGame } from 'ngx-sport';
import { ImageRepository } from '../../lib/image/repository';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { S11Player } from '../../lib/player';
import { S11PlayerRepository } from '../../lib/player/repository';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { StatisticsRepository } from '../../lib/statistics/repository';

import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerBasicsComponent } from './basics.component';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { S11PlayerStatisticsComponent } from './statistics/gameround.component';
import { SportExtensions } from '../../lib/sportExtensions';
import { ScorePointsMap } from '../../lib/score/points';
import { AgainstGameTitleComponent } from '../game/source/title.component';
import { facSofaScore } from '../../shared/poolmodule/icons';

@Component({
  selector: "s11-player-info",
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbAlertModule,
    PlayerBasicsComponent,
    S11PlayerStatisticsComponent,
    AgainstGameTitleComponent,
  ],
  templateUrl: "./playerinfo.modal.component.html",
  styleUrls: ["./playerinfo.modal.component.scss"],
})
export class S11PlayerModalComponent implements OnInit {
  @Input() s11Player: S11Player | undefined;
  @Input() scorePointsMap!: ScorePointsMap;
  @Input() sourceAgainstGame: AgainstGame | undefined;

  public sofaScoreLink: WritableSignal<string | undefined> = signal(undefined);

  public processing: WritableSignal<boolean> = signal(true);

  public statisticsGetter = new StatisticsGetter();

  public faSpinner = faSpinner;
  public facSofaScore = facSofaScore;

  constructor(
    private statisticsRepository: StatisticsRepository,
    private againstGameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    public sportExtensions: SportExtensions,
    public modal: NgbActiveModal
  ) {}

  ngOnInit() {
    if (this.s11Player !== undefined) {
      this.statisticsRepository
        .getPlayerObjects(this.s11Player, this.statisticsGetter)
        .subscribe({
          next: () => {
            this.processing.set(false);
          },
        });
    }

    if (this.sourceAgainstGame !== undefined) {
      this.againstGameRepository
        .getSourceObjectExternalLink(this.sourceAgainstGame)
        .subscribe({
          next: (link: string) => {
            this.sofaScoreLink.set(link);
          },
        });
    }
  }

  getLineClass(s11Player: S11Player): string {
    return this.cssService.getLine(s11Player.getLine());
  }

  openExternalLink(url: string) {
    window.open(url, "_blank");
  }
}
