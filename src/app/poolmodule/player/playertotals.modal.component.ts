import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from "@angular/core";
import { NgbActiveModal, NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { S11Player } from "../../lib/player";
import { S11PlayerRepository } from "../../lib/player/repository";
import { ScorePointsMap } from "../../lib/score/points";
import { JsonTotals } from "../../lib/totals/json";
import { TotalsMapper } from "../../lib/totals/mapper";
import { CSSService } from "../../shared/commonmodule/cssservice";
import { PlayerBasicsComponent } from "./basics.component";
import { SportExtensions } from "../../lib/sportExtensions";

@Component({
  selector: "s11-player-totals-modal",
  standalone: true,
  imports: [NgbAlertModule, PlayerBasicsComponent],
  templateUrl: "./playertotals.modal.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class S11PlayerTotalsModalComponent implements OnInit {
  @Input({ required: true }) s11Player!: S11Player;
  @Input({ required: true }) scorePointsMap!: ScorePointsMap;

  readonly totals = signal<JsonTotals | undefined>(undefined);
  readonly points = signal<number | undefined>(undefined);
  readonly error = signal<string | undefined>(undefined);

  constructor(
    private readonly playerRepository: S11PlayerRepository,
    private readonly totalsMapper: TotalsMapper,
    private readonly cssService: CSSService,
    public readonly sportExtensions: SportExtensions,
    public readonly modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.playerRepository.getTotals(this.s11Player.getId()).subscribe({
      next: (totals: JsonTotals) => {
        this.totals.set(totals);
        this.points.set(
          this.totalsMapper
            .toObject(totals)
            .getPoints(this.s11Player.getLine(), this.scorePointsMap, undefined)
        );
      },
      error: (error: string) => this.error.set(error),
    });
  }

  getLineClass(): string {
    return this.cssService.getLine(this.s11Player.getLine());
  }
}