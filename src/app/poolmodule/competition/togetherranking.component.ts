import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Formation } from 'ngx-sport';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRound } from '../../lib/gameRound';
import { PoolUser } from '../../lib/pool/user';
import { ScorePointsMap } from '../../lib/score/points';
import { PoolUsersTotalsMap } from '../../lib/totals/repository';
import { CSSService } from '../../shared/commonmodule/cssservice'; 

@Component({
  selector: 'app-together-ranking',
  templateUrl: './togetherranking.component.html',
  styleUrls: ['./togetherranking.component.scss']
})
export class TogetherRankingComponent implements OnInit, OnChanges {
  @Input() poolUsers!: PoolUser[];
  @Input() poolUsersTotalsMap: PoolUsersTotalsMap|undefined;
  @Input() gameRoundPoolUserTotalsMap: PoolUsersTotalsMap|undefined;
  @Input() gameRound: GameRound | undefined;
  @Input() scorePointsMap!: ScorePointsMap;
  @Input() badgeCategory: BadgeCategory | undefined;
  
  @Input() header!: boolean;
  // protected togetherRankingCalculator!: TogetherSportRoundRankingCalculator;

  // public sportRankingItems!: SportRoundRankingItem[];
  // public structureNameService!: StructureNameService;
  // protected gameAmountConfig!: GameAmountConfig;
  public rankingItems: RankingItem[]|undefined;
  // protected scoreMap = new ScoreMap();
  protected bestMapForGameRound = new Map<string|number, PoolUser>();
  protected worstMapForGameRound = new Map<string|number, PoolUser>();
  public processing = true;

  constructor(
    // private scoreConfigService: ScoreConfigService,
    private router: Router,
    private modalService: NgbModal,
    private cssService: CSSService) {
  }

  ngOnInit() {
    this.processing = true;
    // this.structureNameService = new StructureNameService(this.startLocationMap);
    // this.togetherRankingCalculator = new TogetherSportRoundRankingCalculator(this.competitionSport, [GameState.InProgress, GameState.Finished]);
    // this.sportRankingItems = this.togetherRankingCalculator.getItemsForPoule(this.poule);
    
    // this.gameAmountConfig = this.poule.getRound().getNumber().getValidGameAmountConfig(this.competitionSport);
    // this.initScoreMap();
    // this.initTableData();    
    // if( this.currentGameRound !== undefined ) {
    //   this.initBestAndWorstMap(this.currentGameRound);
    // }
    if( this.poolUsersTotalsMap !== undefined ) {
      this.updateRankingItems(this.poolUsersTotalsMap);
    }
    
    this.processing = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameRound !== undefined && changes.gameRound.firstChange !== true
      && changes.gameRound.currentValue !== changes.gameRound.previousValue
       ) {
        if( changes.gameRound.currentValue !== undefined) {
          this.updateGameRoundBestAndWorstMap();
        }
    }
    console.log('changes.poolUsersTotalsMap');
    if (changes.poolUsersTotalsMap !== undefined && changes.poolUsersTotalsMap.firstChange !== true
      && changes.poolUsersTotalsMap.currentValue !== changes.poolUsersTotalsMap.previousValue
       ) {
        console.log('changes.poolUsersTotalsMap check');
        if( changes.poolUsersTotalsMap.currentValue !== undefined) {
          this.updateRankingItems(changes.poolUsersTotalsMap.currentValue);
        }
    }
  }

  updateRankingItems(poolUsersTotalsMap: PoolUsersTotalsMap) {
    const poolUsers = this.sortPoolUsers(this.poolUsers, poolUsersTotalsMap);
    let rank = 1;
    const rankingItems: RankingItem[] = [];
    const firstPoolUser = poolUsers.shift();
    if ( firstPoolUser === undefined ) {
      return rankingItems;
    }
    rankingItems.push({ rank, poolUser: firstPoolUser});
    
    let points: number|undefined;
    poolUsers.forEach((poolUser: PoolUser) => {      
      const poolUserTotals = poolUsersTotalsMap.get(poolUser.getId());
      const poolUserPoints = poolUserTotals?.getPoints(this.scorePointsMap, this.badgeCategory) ?? 0;
      if( poolUserTotals === undefined || points === undefined || poolUserPoints < points ) {
        rank++;
      }
      points = poolUserPoints;
      rankingItems.push({ rank, poolUser: poolUser});
    });
    this.rankingItems = rankingItems;
  }

  updateGameRoundBestAndWorstMap() {
    this.bestMapForGameRound = new Map<string|number, PoolUser>();
    this.worstMapForGameRound = new Map<string|number, PoolUser>();
    let bestScore: number | undefined;
    let worstScore: number | undefined;
    const gameRoundPoolUserTotalsMap = this.gameRoundPoolUserTotalsMap;
    if( gameRoundPoolUserTotalsMap === undefined ) {
      return;
    }
    this.poolUsers.forEach((poolUser: PoolUser) => {
      const points = gameRoundPoolUserTotalsMap.get(poolUser.getId())?.getPoints(this.scorePointsMap, this.badgeCategory);
      if( points === undefined ) {
        return;
      }
      if( bestScore === undefined ) {
        bestScore = points;
      }
      if( worstScore === undefined ) {
        worstScore = points;
      }      
      if( points > bestScore ) { // best        
        this.bestMapForGameRound.clear();
        this.bestMapForGameRound.set(poolUser.getId(), poolUser);
        bestScore = points;
      } else if( points === bestScore ) {
        this.bestMapForGameRound.set(poolUser.getId(), poolUser);
      }
      if( points < worstScore ) { // worst
        this.worstMapForGameRound.clear();
        this.worstMapForGameRound.set(poolUser.getId(), poolUser);
        worstScore = points;
      } else if( points === worstScore ) {
        this.worstMapForGameRound.set(poolUser.getId(), poolUser);
      }
    });
    if( this.bestMapForGameRound.size > 3) { // best
      this.bestMapForGameRound.clear();
    }
    if( this.worstMapForGameRound.size > 3) { // worst
      this.worstMapForGameRound.clear();
    }
    // console.log(this.bestMap);
  }

  sortPoolUsers(poolUsers: PoolUser[], poolUsersTotalsMap: PoolUsersTotalsMap): PoolUser[] {
      poolUsers.sort((pooluserA: PoolUser, pooluserB: PoolUser): number => {
        const pointsA = poolUsersTotalsMap.get(pooluserA.getId())?.getPoints(this.scorePointsMap, this.badgeCategory);
        const pointsB = poolUsersTotalsMap.get(pooluserB.getId())?.getPoints(this.scorePointsMap, this.badgeCategory);
        if( pointsA === undefined || pointsB === undefined ) {
          return 0;
        }
        return pointsB - pointsA;
      });
      return poolUsers;
  }


  getPointsBadgeClass(rankingItem: RankingItem): string {
    if( this.bestMapForGameRound.has(rankingItem.rank)) {
      return 'bg-success';  
    } 
    if( this.worstMapForGameRound.has(rankingItem.rank)) {
      return 'bg-danger';  
    }
    return 'bg-points';
  }

  worldcupQualify2(rankingItem: RankingItem): boolean {
    return rankingItem.rank <= CompetitionConfig.MinRankToToQualifyForWorldCup;
  }

  linkToPoolUser(poolUser: PoolUser, gameRound: GameRound | undefined): void {
    this.router.navigate(['/pool/user', poolUser.getPool().getId(), poolUser.getId(), gameRound ? gameRound.getNumber() : 0]);
  }

  getGameRoundPoints(poolUser: PoolUser): number {
    if( this.gameRoundPoolUserTotalsMap !== undefined ) {
      return this.gameRoundPoolUserTotalsMap.get(poolUser.getId())?.getPoints(this.scorePointsMap, this.badgeCategory) ?? 0;
    }
    return 0;
  }

  getTotalPoints(poolUser: PoolUser): number {
    if( this.poolUsersTotalsMap ) {
      return this.poolUsersTotalsMap.get(poolUser.getId())?.getPoints(this.scorePointsMap, this.badgeCategory) ?? 0;
    }
    return 0;
  }

  openModal(modalContent: TemplateRef<any>) {
    const activeModal = this.modalService.open(modalContent);
    activeModal.result.then(() => {
    }, (reason) => {
    });
  }
}


export class FormationMap extends Map<string, Formation> {
}

interface RankingItem {
  rank: number,
  poolUser: PoolUser;
}