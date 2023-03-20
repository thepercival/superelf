import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SportRoundRankingItem, Formation } from 'ngx-sport';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRound } from '../../lib/gameRound';
import { ViewPeriod } from '../../lib/period/view';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { PoolUser } from '../../lib/pool/user';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { CSSService } from '../../shared/commonmodule/cssservice'; 

@Component({
  selector: 'app-together-ranking',
  templateUrl: './togetherranking.component.html',
  styleUrls: ['./togetherranking.component.scss']
})
export class TogetherRankingComponent implements OnInit, OnChanges {
  @Input() poolUsers!: PoolUser[];
  @Input() viewPeriod!: ViewPeriod;
  @Input() gameRound: GameRound | undefined;
  @Input() formationMap!: FormationMap;
  @Input() statisticsGetter!: StatisticsGetter;
  
  @Input() header!: boolean;
  // protected togetherRankingCalculator!: TogetherSportRoundRankingCalculator;

  // public sportRankingItems!: SportRoundRankingItem[];
  // public structureNameService!: StructureNameService;
  // protected gameAmountConfig!: GameAmountConfig;
  public rankingItems: RankingItem[]|undefined;
  // protected scoreMap = new ScoreMap();
  protected bestMapForGameRound = new Map<number, SportRoundRankingItem>();
  protected worstMapForGameRound = new Map<number, SportRoundRankingItem>();
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
    this.processing = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameRound !== undefined && changes.gameRound.firstChange !== true
      && changes.gameRound.currentValue !== changes.gameRound.previousValue
       ) {
        if( changes.gameRound.currentValue !== undefined) {
          this.initBestAndWorstMap(changes.gameRound.currentValue);
        }
    }
  }

  // initScoreMap() {
  //   this.poule.getPlaces().forEach((place: Place) => {
  //     this.scoreMap.set(place.getRoundLocationId(), {});
  //   });
  // }

  /**
   * door door games en plaats elke gameplace ergens in een map
   * 
   * je wilt per deelnemer door de gamerounds lopen en dan per gameRound wil je score weten
   */
  // initTableData() {
  //   let gameRoundWithFinishedGame = 1;

  //   this.getTogetherGames().forEach((game: TogetherGame) => {
  //     const useSubScore = game.getScoreConfig()?.useSubScore();
  //     const finished = game.getState() === GameState.Finished;
  //     game.getTogetherPlaces().forEach((gamePlace: TogetherGamePlace) => {
  //       const gameRoundMap = this.scoreMap.get(gamePlace.getPlace().getRoundLocationId());
  //       if (gameRoundMap === undefined) {
  //         return;
  //       }
  //       const finalScore = this.scoreConfigService.getFinalTogetherScore(gamePlace, useSubScore);
  //       const gameRoundNr = gamePlace.getGameRoundNumber();
  //       if (finished && gameRoundNr > gameRoundWithFinishedGame) {
  //         gameRoundWithFinishedGame = gameRoundNr;
  //       }
  //       gameRoundMap[gameRoundNr] = finalScore;
  //     });
  //   });
  // }


  initBestAndWorstMap(gameRound: GameRound) {

    this.bestMapForGameRound = new Map<number, SportRoundRankingItem>();
    this.worstMapForGameRound = new Map<number, SportRoundRankingItem>();
    let bestScore: number | undefined;
    let worstScore: number | undefined;
    this.poolUsers.forEach((poolUser: PoolUser) => {
      const score = this.getScore(sportRankingItem.getPlaceLocation(),gameRound );      
      if( bestScore === undefined ) {
        bestScore = score;
      }
      if( worstScore === undefined ) {
        worstScore = score;
      }      
      if( score > bestScore ) { // best        
        this.bestMapForGameRound.clear();
        this.bestMapForGameRound.set(sportRankingItem.getUniqueRank(), sportRankingItem);
        bestScore = score;
      } else if( score === bestScore ) {
        this.bestMapForGameRound.set(sportRankingItem.getUniqueRank(), sportRankingItem);
      }
      if( score < worstScore ) { // worst
        this.worstMapForGameRound.clear();
        this.worstMapForGameRound.set(sportRankingItem.getUniqueRank(), sportRankingItem);
        worstScore = score;
      } else if( score === worstScore ) {
        this.worstMapForGameRound.set(sportRankingItem.getUniqueRank(), sportRankingItem);
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


  getPointsBadgeClass(rankingItem: RankingItem): string {
    if( this.bestMapForGameRound.has(rankingItem.rank)) {
      return 'bg-success';  
    } 
    if( this.worstMapForGameRound.has(rankingItem.rank)) {
      return 'bg-danger';  
    }
    return 'bg-points';
  }

  // protected getTogetherGames(): TogetherGame[] {
  //   return this.poule.getTogetherGames().filter((game: TogetherGame) => game.getCompetitionSport() === this.competitionSport);
  // }

  // protected getSportVariant(): Single | AllInOneGame {
  //   const sportVariant = this.competitionSport.getVariant();
  //   if (sportVariant instanceof AgainstH2h || sportVariant instanceof AgainstGpp) {
  //     throw new Error('incorrect sportvariant');
  //   }
  //   return sportVariant;
  // }

  // getScore(placeLocation: PlaceLocation, gameRound: GameRound): number {
  //   const gameRoundMap = this.scoreMap.get(placeLocation.getRoundLocationId());
  //   if (gameRoundMap === undefined) {
  //     return 0;
  //   }
  //   // console.log('score is ', gameRound, gameRoundMap[gameRound]);
  //   return gameRoundMap[gameRound.getNumber()];
  // }

  // getGameRound(competitionSport: CompetitionSport, gameRound: number): number {
  //   return this.getGameRounds(competitionSport)[0] + gameRound;;
  // }

  worldcupQualify2(rankingItem: RankingItem): boolean {
    return rankingItem.rank <= CompetitionConfig.MinRankToToQualifyForWorldCup;
  }

  linkToPoolUser(poolUser: PoolUser, gameRound: GameRound | undefined): void {
    this.router.navigate(['/pool/user', poolUser.getPool().getId(), poolUser.getId(), gameRound ? gameRound.getNumber() : 0]);
  }

  openModal(modalContent: TemplateRef<any>) {
    const activeModal = this.modalService.open(modalContent);
    activeModal.result.then(() => {
    }, (reason) => {
    });
  }


}

interface GameRoundMap {
  [key: number]: number;
}
// class ScoreMap extends Map<string, GameRoundMap> {
// }
export class FormationMap extends Map<string, Formation> {
}

interface RankingItem {
  rank: number,
  poolUser: PoolUser;
}