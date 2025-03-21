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
import { FormationLineTotalsMap, PoolTotalsRepository, PoolUsersTotalsMap } from '../../lib/totals/repository';
import { SuperElfIconComponent } from '../../shared/poolmodule/icon/icon.component';
import { SuperElfBadgeIconComponent } from '../../shared/poolmodule/icon/badge.component';
import { NgIf } from '@angular/common';
import { facWorldCup } from '../../shared/poolmodule/icons';
import { PoolUsersTotalsGetter } from '../../lib/pool/user/totalsGetter';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { concatMap, Observable } from 'rxjs';
import { CompetitorWithGameRoundsPoints, GameRoundsPoints } from '../../lib/views/togetherRankingView/competitorWithGameRoundsPoints';

@Component({
  selector: "app-together-ranking",
  standalone: true,
  imports: [SuperElfBadgeIconComponent, FontAwesomeModule],
  templateUrl: "./togetherranking.component.html",
  styleUrls: ["./togetherranking.component.scss"],
})
export class TogetherRankingComponent implements OnInit, OnChanges {
  readonly competitorsWithGameRoundsPoints =
    input.required<CompetitorWithGameRoundsPoints[]>();
  readonly viewPeriod = input.required<ViewPeriod>();
  // readonly scorePointsMap = input.required<ScorePointsMap>();
  readonly header = input.required<boolean>();
  readonly badgeCategory = input<BadgeCategory>();

  protected bestWorstGameRoundMap = new Map<number, MinMaxItem>();

  public faSpinner = faSpinner;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public nameService: SuperElfNameService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.competitorsWithGameRoundsPoints !== undefined &&
      changes.competitorsWithGameRoundsPoints.firstChange !== true &&
      changes.competitorsWithGameRoundsPoints.currentValue !== changes.competitorsWithGameRoundsPoints.previousValue
    ) {
      // console.log('changes.gameRound', changes.gameRound);
      if (changes.competitorsWithGameRoundsPoints.currentValue !== undefined) {
        this.updateBestWorstGameRoundMap();
      }
    }
  }

  // getRankingItems(): Observable<RankingItem[]> {
  //   // this.poolUsersTotalsGetter.getPoolUserTotals(Pool, game);
  //   //console.log(this.poolUsersTotalsMap);
  //   // const poolUsers = this.sortPoolUsers(
  //   //   this.poolUsers(),
  //   //   this.gameRoundPoolUserTotalsMap()
  //   // );
  //   let rank = 1;
  //   const rankingItems: RankingItem[] = this.poolUsers().map(
  //     (poolUser: PoolUser): RankingItem => {
  //       this.poolUsersTotalsGetter
  //         .getViewPeriodTotals(poolUser.getPool(), this.viewPeriod())
  //         .pipe(
  //           concatMap((viewPeriodPoolUserTotals: PoolUsersTotalsMap) => {
  //             const viewPeriodTotals: FormationLineTotalsMap | undefined =
  //               viewPeriodPoolUserTotals.get(poolUser.getId());
  //             if (undefined !== viewPeriodTotals) {
  //               const totalPoints: number = viewPeriodTotals.getPoints(
  //                 this.scorePointsMap(),
  //                 this.badgeCategory()
  //               );
  //             }
  //             return of();
  //           })
  //         );

  //       return {
  //         rank: 0,
  //         poolUser: poolUser,
  //         gameRoundsPoints: gameRoundsPoints,
  //       };
  //     }
  //   );

  //   const firstPoolUser = poolUsers.shift();
  //   if (firstPoolUser === undefined) {
  //     return;
  //   }
  //   rankingItems.push({ rank, poolUser: firstPoolUser });
  //   const poolUserTotals = this.gameRoundPoolUserTotalsMap().get(
  //     firstPoolUser.getId()
  //   );
  //   let points: number =
  //     poolUserTotals?.getPoints(this.scorePointsMap(), this.badgeCategory()) ??
  //     0;

  //   let nrOfEvenRanks = 0;
  //   poolUsers.forEach((poolUser: PoolUser) => {
  //     const poolUserTotals = this.gameRoundPoolUserTotalsMap().get(
  //       poolUser.getId()
  //     );
  //     const poolUserPoints =
  //       poolUserTotals?.getPoints(
  //         this.scorePointsMap(),
  //         this.badgeCategory()
  //       ) ?? 0;
  //     if (
  //       poolUserTotals === undefined ||
  //       points === undefined ||
  //       poolUserPoints < points
  //     ) {
  //       rank++;
  //       rank += nrOfEvenRanks;
  //       nrOfEvenRanks = 0;
  //     } else {
  //       nrOfEvenRanks++;
  //     }
  //     points = poolUserPoints;
  //     rankingItems.push({ rank, poolUser: poolUser });
  //   });
  //   // console.log(rankingItems);
  //   this.rankingItems = rankingItems;
  // }

  updateBestWorstGameRoundMap() {
    const minMaxGameRoundMap = new Map<number, MinMaxItem>();

    this.competitorsWithGameRoundsPoints().forEach( (competitor: CompetitorWithGameRoundsPoints) => {

      competitor.gameRoundsPoints.forEach( (gameRoundsPoints: GameRoundsPoints) => {

        let gameRoundMinMax = minMaxGameRoundMap.get(gameRoundsPoints.number);
        if( gameRoundMinMax === undefined) {
          const poolUserMap = new Map<string | number, PoolUser>()
          poolUserMap.set(gameRoundsPoints.number, competitor.competitor.getPoolUser());
          const minMaxItem = {
            value: gameRoundsPoints.points,
            poolUsersMap: poolUserMap
          };
          
          minMaxGameRoundMap.set(gameRoundsPoints.number, minMaxItem);
        }

        // const points = poolUserWithGameRoundsPoints.viewPeriodPoints getPoints(this.scorePointsMap(), this.badgeCategory());
        // if (points === undefined) {
        //   return;
        // }
        // if (bestScore === undefined) {
        //   bestScore = points;
        // }
        // if (worstScore === undefined) {
        //   worstScore = points;
        // }
        // if (points > bestScore) {
        //   // best
        //   this.bestMapForGameRound.clear();
        //   this.bestMapForGameRound.set(poolUser.getId(), poolUser);
        //   bestScore = points;
        // } else if (points === bestScore) {
        //   this.bestMapForGameRound.set(poolUser.getId(), poolUser);
        // }
        // if (points < worstScore) {
        //   // worst
        //   this.worstMapForGameRound.clear();
        //   this.worstMapForGameRound.set(poolUser.getId(), poolUser);
        //   worstScore = points;
        // } else if (points === worstScore) {
        //   this.worstMapForGameRound.set(poolUser.getId(), poolUser);
        // }
      })
    });
    // if (this.bestMapForGameRound.size > 3) {
    //   // best
    //   this.bestMapForGameRound.clear();
    // }
    // if (this.worstMapForGameRound.size > 3) {
    //   // worst
    //   this.worstMapForGameRound.clear();
    // }

    this.bestWorstGameRoundMap = minMaxGameRoundMap;
  }

  // sortPoolUsers(
  //   poolUsers: PoolUser[],
  //   poolUsersTotalsMap: PoolUsersTotalsMap
  // ): PoolUser[] {
  //   const sorted = poolUsers.slice();
  //   sorted.sort((pooluserA: PoolUser, pooluserB: PoolUser): number => {
  //     const scorePointsMap = this.scorePointsMap();
  //     const badgeCategory = this.badgeCategory();
  //     const pointsA = poolUsersTotalsMap
  //       .get(pooluserA.getId())
  //       ?.getPoints(scorePointsMap, badgeCategory);
  //     const pointsB = poolUsersTotalsMap
  //       .get(pooluserB.getId())
  //       ?.getPoints(scorePointsMap, badgeCategory);
  //     if (pointsA === undefined || pointsB === undefined) {
  //       return 0;
  //     }
  //     return pointsB - pointsA;
  //   });
  //   return sorted;
  // }

  getPointsBadgeClass(poolUser: PoolUser, gameRoundNr: number): string {
    const bestWorstGameRoundMap = this.bestWorstGameRoundMap.get(gameRoundNr);
    if (bestWorstGameRoundMap) {
      if (bestWorstGameRoundMap.poolUsersMap.has(poolUser.getId())) {
        return "bg-success";
      }
      if (bestWorstGameRoundMap.poolUsersMap.has(poolUser.getId())) {
        return "bg-danger";
      }
    }
    return "bg-points";
  }

  // hasAchievement(rank: number): boolean {
  //   if (this.badgeCategory() === undefined) {
  //     return (
  //       rank <= CompetitionConfig.MinRankToToQualifyForWorldCup
  //     );
  //   }
  //   return rank <= 1;
  // }

  linkToPoolUser(poolUser: PoolUser, gameRoundNr: number | undefined): void {
    this.router.navigate([
      "/pool/user",
      poolUser.getPool().getId(),
      poolUser.getId(),
      gameRoundNr ? gameRoundNr : 0,
    ]);
  }

  // getGameRoundPoints(poolUser: PoolUser): number {
  //   const gameRoundPoolUserTotalsMap = this.gameRoundPoolUserTotalsMap();
  //   if (gameRoundPoolUserTotalsMap !== undefined) {
  //     return (
  //       gameRoundPoolUserTotalsMap
  //         .get(poolUser.getId())
  //         ?.getPoints(this.scorePointsMap(), this.badgeCategory()) ?? 0
  //     );
  //   }
  //   return 0;
  // }

  // getTotalPoints(poolUser: PoolUser): number {
  //   const poolUsersTotalsMap = this.gameRoundPoolUserTotalsMap();
  //   if (poolUsersTotalsMap) {
  //     return (
  //       poolUsersTotalsMap
  //         .get(poolUser.getId())
  //         ?.getPoints(this.scorePointsMap(), this.badgeCategory()) ?? 0
  //     );
  //   }
  //   return 0;
  // }

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


// export class FormationMap extends Map<string, Formation> {
// }

interface MinMaxItem {
  value: number;
  poolUsersMap: Map<string | number, PoolUser>
}

