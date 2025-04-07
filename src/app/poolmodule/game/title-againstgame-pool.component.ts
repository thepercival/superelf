import { Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { GameRound } from '../../lib/gameRound';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditPeriod } from '../../lib/periods/editPeriod';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CompetitorPoolUserAndFormation } from '../poule/againstgames.component';
import { AgainstPoule, AgainstSide, GameState, Poule, StartLocationMap } from 'ngx-sport';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { Router } from '@angular/router';

@Component({
  selector: "app-title-againstgame-pool",
  standalone: true,
  imports: [FontAwesomeModule, NgbProgressbarModule],
  templateUrl: "./title-againstgame-pool.component.html",
  styleUrls: ["./title-againstgame-pool.component.scss"],
})
export class PouleTitleWithGameRoundsComponent implements OnInit {
  readonly homeCompetitorPoolUserAndFormation =
    input.required<CompetitorPoolUserAndFormation>();
  readonly awayCompetitorPoolUserAndFormation =
    input.required<CompetitorPoolUserAndFormation>();
  readonly poolPoule = input.required<Poule>();
  readonly competitionConfig = input.required<CompetitionConfig>();
  readonly viewPeriod = input.required<ViewPeriod>();
  readonly gameRounds = input.required<GameRound[]>();
  readonly activeGameRound = input.required<GameRound>();
  readonly statisticsGetter = input.required<StatisticsGetter>();

  @Output() selectGameRound = new EventEmitter<GameRound>();

  constructor(private router: Router) {}

  ngOnInit() {
    const nrOfCompetitors: number = this.competitionConfig()
      .getSourceCompetition()
      .getTeamCompetitors().length;
    // const nrOfSegments = Math.floor(nrOfCompetitors / 2);
    // this.segments = Array.from({ length: nrOfSegments }, (_, i) => i + 1);
  }

  isCurrentBeforeTransferPeriod(): boolean {
    return this.CurrentViewPeriod != this.TransferPeriod.getViewPeriod();
  }

  get HomeSide(): AgainstSide {
    return AgainstSide.Home;
  }
  get AwaySide(): AgainstSide {
    return AgainstSide.Away;
  }

  get CurrentViewPeriod(): ViewPeriod | undefined {
    return this.gameRounds()[0]?.viewPeriod ?? undefined;
  }

  get AssembleViewPeriod(): ViewPeriod {
    return this.competitionConfig().getAssemblePeriod().getViewPeriod();
  }
  get TransferViewPeriod(): ViewPeriod {
    return this.TransferPeriod.getViewPeriod();
  }
  get TransferPeriod(): EditPeriod {
    return this.competitionConfig().getTransferPeriod();
  }

  getScore(
    side: AgainstSide,
    competitor: CompetitorPoolUserAndFormation
  ): string {
    const poolPoule = this.poolPoule();
    if (poolPoule.getGamesState() === GameState.Created) {
      return " - ";
    }
    const startLocationMap = new StartLocationMap([competitor.competitor]);
    const againstPoule = new AgainstPoule(poolPoule, startLocationMap);
    return againstPoule.getScore(side);
  }

  // hasPreviousGameRounds(): boolean {
  //   const firstGameRound = this.firstGameRound();
  //   if (firstGameRound === undefined) {
  //     return false;
  //   }
  //   const smallestGameRound: GameRound = this.gameRounds()[0];
  //   return firstGameRound.number < smallestGameRound.number;
  // }

  // getCurrentLabel(): string {
  //   const current = this.current();
  //   if (current === undefined) {
  //     return "alle speelronden";
  //   }
  //   return "speelronde " + current.number;
  // }

  // inAssembleViewPeriod(): boolean {
  //   return this.assembleViewPeriod()?.isIn() ?? false;
  // }

  // inTransferViewPeriod(): boolean {
  //   return this.transferViewPeriod()?.isIn() ?? false;
  // }

  hasQualified(side: AgainstSide): boolean {
    if (this.poolPoule().getPlaces().length == 1) {
      return true;
    }
    const againstPoule = this.getAgainstPoule();
    if (againstPoule === undefined) {
      return false;
    }
    return againstPoule.hasQualified(side);
  }

  getAgainstPoule(): AgainstPoule | undefined {
    // const startLocationMap = new this.structureNameService.getStartLocationMap();
    // if (startLocationMap === undefined) {
    //   return undefined;
    // }
    const startLocationMap = new StartLocationMap([
      this.homeCompetitorPoolUserAndFormation().competitor,
      this.awayCompetitorPoolUserAndFormation().competitor,
    ]);
    return new AgainstPoule(this.poolPoule(), startLocationMap);
  }

  getPercentageCreated(gameRound: GameRound): number {
    return Math.floor((gameRound.created / gameRound.totalNrOfGames) * 100);
  }

  getPercentageInProgress(gameRound: GameRound): number {
    return Math.floor((gameRound.inProgress / gameRound.totalNrOfGames) * 100);
  }

  getPercentageFinished(gameRound: GameRound): number {
    return Math.floor((gameRound.finished / gameRound.totalNrOfGames) * 100);
  }

  public linkToPoolUser(
    competitor: CompetitorPoolUserAndFormation,
    gameRound: GameRound | undefined
  ): void {
    this.router.navigate([
      "/pool/user",
      competitor.poolUser.getPool().getId(),
      competitor.poolUser.getId(),
      gameRound ? gameRound.number : 0,
    ]);
  }
}
