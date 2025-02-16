import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef, WritableSignal, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Formation } from 'ngx-sport';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRound } from '../../lib/gameRound';
import { SuperElfNameService } from '../../lib/nameservice';
import { PoolUser } from '../../lib/pool/user';
import { ScorePointsMap } from '../../lib/score/points';
import { PoolUsersTotalsMap } from '../../lib/totals/repository';
import { SuperElfIconComponent } from '../../shared/poolmodule/icon/icon.component';
import { SuperElfBadgeIconComponent } from '../../shared/poolmodule/icon/badge.component';
import { NgIf } from '@angular/common';
import { facWorldCup } from '../../shared/poolmodule/icons';

@Component({
  selector: "app-together-ranking",
  standalone: true,
  imports: [SuperElfIconComponent, SuperElfBadgeIconComponent, NgIf],
  templateUrl: "./togetherranking.component.html",
  styleUrls: ["./togetherranking.component.scss"],
})
export class TogetherRankingComponent implements OnInit, OnChanges {
  readonly poolUsers = input.required<PoolUser[]>();
  readonly poolUsersTotalsMap = input.required<PoolUsersTotalsMap>();
  readonly gameRoundPoolUserTotalsMap = input<PoolUsersTotalsMap>();
  readonly gameRound = input<GameRound>();
  readonly scorePointsMap = input.required<ScorePointsMap>();
  readonly badgeCategory = input<BadgeCategory>();

  readonly header = input.required<boolean>();
  public rankingItems: RankingItem[] | undefined;
  protected bestMapForGameRound = new Map<string | number, PoolUser>();
  protected worstMapForGameRound = new Map<string | number, PoolUser>();
  public processing: WritableSignal<boolean> = signal(true);
  public facWorldCup = facWorldCup;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public nameService: SuperElfNameService
  ) {}

  ngOnInit() {
    this.processing.set(true);

    this.updateRankingItems();
    // console.log('init ranking');
    this.updateGameRoundBestAndWorstMap();
    this.processing.set(false);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.gameRound !== undefined &&
      changes.gameRound.firstChange !== true &&
      changes.gameRound.currentValue !== changes.gameRound.previousValue
    ) {
      // console.log('changes.gameRound', changes.gameRound);
      if (changes.gameRound.currentValue !== undefined) {
        this.updateGameRoundBestAndWorstMap();
      }
    }
    if (
      changes.badgeCategory.firstChange !== true &&
      changes.badgeCategory.currentValue !== changes.badgeCategory.previousValue
    ) {
      this.updateRankingItems();
    }
  }

  updateRankingItems(): void {
    //console.log(this.poolUsersTotalsMap);
    const poolUsers = this.sortPoolUsers(
      this.poolUsers(),
      this.poolUsersTotalsMap()
    );
    let rank = 1;
    const rankingItems: RankingItem[] = [];
    const firstPoolUser = poolUsers.shift();
    if (firstPoolUser === undefined) {
      return;
    }
    rankingItems.push({ rank, poolUser: firstPoolUser });
    const poolUserTotals = this.poolUsersTotalsMap().get(firstPoolUser.getId());
    let points: number =
      poolUserTotals?.getPoints(this.scorePointsMap(), this.badgeCategory()) ??
      0;

    let nrOfEvenRanks = 0;
    poolUsers.forEach((poolUser: PoolUser) => {
      const poolUserTotals = this.poolUsersTotalsMap().get(poolUser.getId());
      const poolUserPoints =
        poolUserTotals?.getPoints(
          this.scorePointsMap(),
          this.badgeCategory()
        ) ?? 0;
      if (
        poolUserTotals === undefined ||
        points === undefined ||
        poolUserPoints < points
      ) {
        rank++;
        rank += nrOfEvenRanks;
        nrOfEvenRanks = 0;
      } else {
        nrOfEvenRanks++;
      }
      points = poolUserPoints;
      rankingItems.push({ rank, poolUser: poolUser });
    });
    // console.log(rankingItems);
    this.rankingItems = rankingItems;
  }

  updateGameRoundBestAndWorstMap() {
    this.bestMapForGameRound = new Map<string | number, PoolUser>();
    this.worstMapForGameRound = new Map<string | number, PoolUser>();
    let bestScore: number | undefined;
    let worstScore: number | undefined;
    const gameRoundPoolUserTotalsMap = this.gameRoundPoolUserTotalsMap();
    if (gameRoundPoolUserTotalsMap === undefined) {
      return;
    }
    this.poolUsers().forEach((poolUser: PoolUser) => {
      const points = gameRoundPoolUserTotalsMap
        .get(poolUser.getId())
        ?.getPoints(this.scorePointsMap(), this.badgeCategory());
      if (points === undefined) {
        return;
      }
      if (bestScore === undefined) {
        bestScore = points;
      }
      if (worstScore === undefined) {
        worstScore = points;
      }
      if (points > bestScore) {
        // best
        this.bestMapForGameRound.clear();
        this.bestMapForGameRound.set(poolUser.getId(), poolUser);
        bestScore = points;
      } else if (points === bestScore) {
        this.bestMapForGameRound.set(poolUser.getId(), poolUser);
      }
      if (points < worstScore) {
        // worst
        this.worstMapForGameRound.clear();
        this.worstMapForGameRound.set(poolUser.getId(), poolUser);
        worstScore = points;
      } else if (points === worstScore) {
        this.worstMapForGameRound.set(poolUser.getId(), poolUser);
      }
    });
    if (this.bestMapForGameRound.size > 3) {
      // best
      this.bestMapForGameRound.clear();
    }
    if (this.worstMapForGameRound.size > 3) {
      // worst
      this.worstMapForGameRound.clear();
    }
  }

  sortPoolUsers(
    poolUsers: PoolUser[],
    poolUsersTotalsMap: PoolUsersTotalsMap
  ): PoolUser[] {
    const sorted = poolUsers.slice();
    sorted.sort((pooluserA: PoolUser, pooluserB: PoolUser): number => {
      const scorePointsMap = this.scorePointsMap();
      const badgeCategory = this.badgeCategory();
      const pointsA = poolUsersTotalsMap
        .get(pooluserA.getId())
        ?.getPoints(scorePointsMap, badgeCategory);
      const pointsB = poolUsersTotalsMap
        .get(pooluserB.getId())
        ?.getPoints(scorePointsMap, badgeCategory);
      if (pointsA === undefined || pointsB === undefined) {
        return 0;
      }
      return pointsB - pointsA;
    });
    return sorted;
  }

  getPointsBadgeClass(rankingItem: RankingItem): string {
    if (this.bestMapForGameRound.has(rankingItem.poolUser.getId())) {
      return "bg-success";
    }
    if (this.worstMapForGameRound.has(rankingItem.poolUser.getId())) {
      return "bg-danger";
    }
    return "bg-points";
  }

  hasAchievement(rankingItem: RankingItem): boolean {
    if (this.badgeCategory() === undefined) {
      return (
        rankingItem.rank <= CompetitionConfig.MinRankToToQualifyForWorldCup
      );
    }
    return rankingItem.rank <= 1;
  }

  linkToPoolUser(poolUser: PoolUser, gameRound: GameRound | undefined): void {
    this.router.navigate([
      "/pool/user",
      poolUser.getPool().getId(),
      poolUser.getId(),
      gameRound ? gameRound.getNumber() : 0,
    ]);
  }

  getGameRoundPoints(poolUser: PoolUser): number {
    const gameRoundPoolUserTotalsMap = this.gameRoundPoolUserTotalsMap();
    if (gameRoundPoolUserTotalsMap !== undefined) {
      return (
        gameRoundPoolUserTotalsMap
          .get(poolUser.getId())
          ?.getPoints(this.scorePointsMap(), this.badgeCategory()) ?? 0
      );
    }
    return 0;
  }

  getTotalPoints(poolUser: PoolUser): number {
    const poolUsersTotalsMap = this.poolUsersTotalsMap();
    if (poolUsersTotalsMap) {
      return (
        poolUsersTotalsMap
          .get(poolUser.getId())
          ?.getPoints(this.scorePointsMap(), this.badgeCategory()) ?? 0
      );
    }
    return 0;
  }

  openModal(
    worldCupModalContent: TemplateRef<any>,
    badgeCategoryModalContent: TemplateRef<any>
  ) {
    const modalContent =
      this.badgeCategory() !== undefined
        ? badgeCategoryModalContent
        : worldCupModalContent;
    const activeModal = this.modalService.open(modalContent);
    activeModal.result.then(
      () => {},
      (reason) => {}
    );
  }
}


export class FormationMap extends Map<string, Formation> {
}

interface RankingItem {
  rank: number,
  poolUser: PoolUser;
}