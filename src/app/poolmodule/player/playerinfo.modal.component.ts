import { Component, Input, OnInit, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
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
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlayerBasicsComponent } from './basics.component';
import { faCircleInfo, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SportExtensions } from '../../lib/sportExtensions';
import { ScorePointsMap } from '../../lib/score/points';
import { AgainstGameTitleComponent } from '../game/source/title.component';
import { facSofaScore } from '../../shared/poolmodule/icons';
import { Statistics } from '../../lib/statistics';
import { S11PlayerStatisticsInfoModalComponent } from './statistics/info.modal.component';
import { S11PlayerStatisticsComponent } from './statistics/gameround.component';

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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  public faCircleInfo = faCircleInfo;
  public facSofaScore = facSofaScore;

  constructor(
    private statisticsRepository: StatisticsRepository,
    private againstGameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    public sportExtensions: SportExtensions,
    public modal: NgbActiveModal,
    private modalService: NgbModal
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

  openStatisticsInfo(statistics: Statistics): void {
    const modalRef = this.modalService.open(S11PlayerStatisticsInfoModalComponent, { scrollable: true });
    modalRef.componentInstance.playerName = this.s11Player?.getPerson().getName() ?? '';
    modalRef.componentInstance.statistics = statistics;
  }

  openExternalLink(url: string) {
    window.open(url, "_blank");
  }
}
