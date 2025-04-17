import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { SuperElfNameService } from '../../lib/nameservice';
import { PoolUser } from '../../lib/pool/user';
import { SuperElfBadgeIconComponent } from '../../shared/poolmodule/icon/badge.component';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { CompetitorWithGameRoundsPoints, GameRoundsPoints } from '../../lib/views/togetherRankingView/competitorWithGameRoundsPoints';

@Component({
  selector: "app-together-ranking",
  standalone: true,
  imports: [SuperElfBadgeIconComponent, FontAwesomeModule],
  templateUrl: "./togetherranking.component.html",
  styleUrls: ["./togetherranking.component.scss"],
})
export class TogetherRankingComponent implements OnInit, OnChanges {
  readonly competitorsWithGameRoundsPoints = input.required<CompetitorWithGameRoundsPoints[]>();
  readonly viewPeriod = input.required<ViewPeriod>();
  readonly header = input.required<boolean>();
  readonly badgeCategory = input<BadgeCategory>();
  readonly showTransfers = input<boolean>(false);

  @Output() showCompetitorTransfers = new EventEmitter<PoolUser>();
  @Output() linkToCompetitor = new EventEmitter<CompetitorWithGameRoundsPoints>();

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
      changes.competitorsWithGameRoundsPoints.currentValue !== changes.competitorsWithGameRoundsPoints.previousValue 
    ) {
      this.updateBestWorstGameRoundMap();
    }
  }

  updateBestWorstGameRoundMap() {
    const minMaxGameRoundMap = new Map<number, MinMaxItem>();

    this.competitorsWithGameRoundsPoints().forEach( (competitor: CompetitorWithGameRoundsPoints) => {

      const poolUser = competitor.competitor.getPoolUser();
      
      competitor.gameRoundsPoints.forEach( (gameRoundsPoints: GameRoundsPoints) => {        
        let gameRoundMinMax = minMaxGameRoundMap.get(gameRoundsPoints.number);
        if( gameRoundMinMax === undefined) {
          const poolUserMapMin = new Map<string | number, PoolUser>()
          poolUserMapMin.set(gameRoundsPoints.number, poolUser);
          const min = {
            value: gameRoundsPoints.points,
            poolUsersMap: poolUserMapMin,
          };
          const poolUserMapMax = new Map<string | number, PoolUser>();
          poolUserMapMax.set(gameRoundsPoints.number, poolUser);
          const max = {
            value: gameRoundsPoints.points,
            poolUsersMap: poolUserMapMax,
          }; 
          const minMaxItem: MinMaxItem = { min, max };
          minMaxGameRoundMap.set(gameRoundsPoints.number, minMaxItem);
        } else if( gameRoundsPoints.points <= gameRoundMinMax.min.value  ) {            
          if( gameRoundsPoints.points < gameRoundMinMax.min.value ) {
            gameRoundMinMax.min.value = gameRoundsPoints.points;
            gameRoundMinMax.min.poolUsersMap.clear();
          }
          gameRoundMinMax.min.poolUsersMap.set(poolUser.getId(), poolUser);
        } else if( gameRoundsPoints.points >= gameRoundMinMax.max.value  ) {            
          if( gameRoundsPoints.points > gameRoundMinMax.max.value ) {
            gameRoundMinMax.max.value = gameRoundsPoints.points;
            gameRoundMinMax.max.poolUsersMap.clear();
          }
          gameRoundMinMax.max.poolUsersMap.set(poolUser.getId(), poolUser);
        }
      })
    });

    Array.from(minMaxGameRoundMap.values()).forEach((minMaxItem: MinMaxItem) => {
      if( minMaxItem.min.poolUsersMap.size > 3 ) {
        minMaxItem.min.poolUsersMap.clear();
      }
      if (minMaxItem.max.poolUsersMap.size > 3) {
        minMaxItem.max.poolUsersMap.clear();
      }
    });

    this.bestWorstGameRoundMap = minMaxGameRoundMap;
  }

  getBestWorstBadgeClass(poolUser: PoolUser, gameRoundNr: number): string {    
    const bestWorstGameRoundMap = this.bestWorstGameRoundMap.get(gameRoundNr);    
    if (bestWorstGameRoundMap) {      
      if (bestWorstGameRoundMap.max.poolUsersMap.has(+poolUser.getId())) {
        return "btn-points-success";
      }
      if (bestWorstGameRoundMap.min.poolUsersMap.has(+poolUser.getId())) {
        return "btn-points-danger";
      }
    }
    return "btn-points";
  }

  // hasAchievement(rank: number): boolean {
  //   if (this.badgeCategory() === undefined) {
  //     return (
  //       rank <= CompetitionConfig.MinRankToToQualifyForWorldCup
  //     );
  //   }
  //   return rank <= 1;
  // }

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
  min: {
    value: number;
    poolUsersMap: Map<string | number, PoolUser>
  },
  max: {
    value: number;
    poolUsersMap: Map<string | number, PoolUser>
  }
}

