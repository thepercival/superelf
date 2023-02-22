import { Component, Input, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Poule, GameAmountConfig, GameState, ScoreConfigService, TogetherGame, CompetitionSport, TogetherGamePlace, TogetherSportRoundRankingCalculator, SportRoundRankingItem, PlaceLocation, Place, AgainstGpp, AgainstH2h, Single, AllInOneGame, StartLocationMap, StructureNameService, TogetherScore } from 'ngx-sport';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRound } from '../../lib/gameRound';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { PoolUser } from '../../lib/pool/user';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { ViewPort, ViewPortManager, ViewPortNrOfColumnsMap } from '../../shared/commonmodule/viewPortManager';

@Component({
  selector: 'app-together-ranking',
  templateUrl: './togetherranking.component.html',
  styleUrls: ['./togetherranking.component.scss']
})
export class TogetherRankingComponent implements OnInit {
  @Input() poule!: Poule;
  @Input() startLocationMap!: StartLocationMap;
  @Input() competitionSport!: CompetitionSport;
  @Input() currentGameRound: GameRound | undefined;
  @Input() header!: boolean;
  protected togetherRankingCalculator!: TogetherSportRoundRankingCalculator;

  public sportRankingItems!: SportRoundRankingItem[];
  public structureNameService!: StructureNameService;
  protected gameAmountConfig!: GameAmountConfig;
  protected scoreMap = new ScoreMap();
  protected bestMap = new Map<number, SportRoundRankingItem>();
  protected worstMap = new Map<number, SportRoundRankingItem>();
  public processing = true;

  constructor(
    private scoreConfigService: ScoreConfigService,
    private router: Router,
    private modalService: NgbModal,
    private cssService: CSSService) {
  }

  ngOnInit() {
    this.processing = true;
    this.structureNameService = new StructureNameService(this.startLocationMap);
    this.togetherRankingCalculator = new TogetherSportRoundRankingCalculator(this.competitionSport, [GameState.InProgress, GameState.Finished]);
    this.sportRankingItems = this.togetherRankingCalculator.getItemsForPoule(this.poule);
    let total = 0;
    this.poule.getTogetherGames().forEach((g: TogetherGame) => {
      g.getTogetherPlaces().forEach((tg: TogetherGamePlace) => {
          if( tg.getPlace().getPlaceNr() === 1 ) {
            tg.getScores().forEach((sc: TogetherScore) => {
              if( tg.getPlace().getPlaceNr() === 1 ) {
                console.log('gr' + tg.getGameRoundNumber() , sc.getScore());
                total += sc.getScore();
              }
            });
          }
        });
    });
    console.log('total = ' + total);
    this.gameAmountConfig = this.poule.getRound().getNumber().getValidGameAmountConfig(this.competitionSport);
    this.initScoreMap();
    this.initTableData();    
    if( this.currentGameRound !== undefined ) {
      this.initBestAndWorstMap(this.currentGameRound);
    }
    this.processing = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentGameRound !== undefined && changes.currentGameRound.firstChange !== true
      && changes.currentGameRound.currentValue !== changes.currentGameRound.previousValue
       ) {
        if( changes.currentGameRound.currentValue !== undefined) {
          this.initBestAndWorstMap(changes.currentGameRound.currentValue);
        }
    }
  }

  initScoreMap() {
    this.poule.getPlaces().forEach((place: Place) => {
      this.scoreMap.set(place.getRoundLocationId(), {});
    });
  }

  /**
   * door door games en plaats elke gameplace ergens in een map
   * 
   * je wilt per deelnemer door de gamerounds lopen en dan per gameRound wil je score weten
   */
  initTableData() {
    let gameRoundWithFinishedGame = 1;

    this.getTogetherGames().forEach((game: TogetherGame) => {
      const useSubScore = game.getScoreConfig()?.useSubScore();
      const finished = game.getState() === GameState.Finished;
      game.getTogetherPlaces().forEach((gamePlace: TogetherGamePlace) => {
        const gameRoundMap = this.scoreMap.get(gamePlace.getPlace().getRoundLocationId());
        if (gameRoundMap === undefined) {
          return;
        }
        const finalScore = this.scoreConfigService.getFinalTogetherScore(gamePlace, useSubScore);
        const gameRoundNr = gamePlace.getGameRoundNumber();
        if (finished && gameRoundNr > gameRoundWithFinishedGame) {
          gameRoundWithFinishedGame = gameRoundNr;
        }
        gameRoundMap[gameRoundNr] = finalScore;
      });
    });
  }

  initBestAndWorstMap(gameRound: GameRound) {

    this.bestMap = new Map<number, SportRoundRankingItem>();
    this.worstMap = new Map<number, SportRoundRankingItem>();
    let bestScore: number | undefined;
    let worstScore: number | undefined;
    this.sportRankingItems.forEach((sportRankingItem: SportRoundRankingItem) => {
      const score = this.getScore(sportRankingItem.getPlaceLocation(),gameRound );      
      if( bestScore === undefined ) {
        bestScore = score;
      }
      if( worstScore === undefined ) {
        worstScore = score;
      }      
      if( score > bestScore ) { // best        
        this.bestMap.clear();
        this.bestMap.set(sportRankingItem.getUniqueRank(), sportRankingItem);
        bestScore = score;
      } else if( score === bestScore ) {
        this.bestMap.set(sportRankingItem.getUniqueRank(), sportRankingItem);
      }
      if( score < worstScore ) { // worst
        this.worstMap.clear();
        this.worstMap.set(sportRankingItem.getUniqueRank(), sportRankingItem);
        worstScore = score;
      } else if( score === worstScore ) {
        this.worstMap.set(sportRankingItem.getUniqueRank(), sportRankingItem);
      }
    });
    if( this.bestMap.size > 3) { // best
      this.bestMap.clear();
    }
    if( this.worstMap.size > 3) { // worst
      this.worstMap.clear();
    }
    // console.log(this.bestMap);
  }


  getPointsBadgeClass(sportRankingItem: SportRoundRankingItem): string {
    if( this.bestMap.has(sportRankingItem.getUniqueRank())) {
      return 'bg-success';  
    } 
    if( this.worstMap.has(sportRankingItem.getUniqueRank())) {
      return 'bg-danger';  
    }
    return 'bg-points';
  }

  protected getTogetherGames(): TogetherGame[] {
    return this.poule.getTogetherGames().filter((game: TogetherGame) => game.getCompetitionSport() === this.competitionSport);
  }

  protected getSportVariant(): Single | AllInOneGame {
    const sportVariant = this.competitionSport.getVariant();
    if (sportVariant instanceof AgainstH2h || sportVariant instanceof AgainstGpp) {
      throw new Error('incorrect sportvariant');
    }
    return sportVariant;
  }

  getScore(placeLocation: PlaceLocation, gameRound: GameRound): number {
    const gameRoundMap = this.scoreMap.get(placeLocation.getRoundLocationId());
    if (gameRoundMap === undefined) {
      return 0;
    }
    // console.log('score is ', gameRound, gameRoundMap[gameRound]);
    return gameRoundMap[gameRound.getNumber()];
  }

  // getGameRound(competitionSport: CompetitionSport, gameRound: number): number {
  //   return this.getGameRounds(competitionSport)[0] + gameRound;;
  // }

  worldcupQualify2(rankingItem: SportRoundRankingItem): boolean {
    return rankingItem.getUniqueRank() <= CompetitionConfig.NrToQualifyForWorldCup;
  }

  getPoolUser(place: Place): PoolUser | undefined {
    const startLocation = place.getStartLocation();
    if (startLocation === undefined) {
      return;
    }
    const competitor = <PoolCompetitor>this.startLocationMap.getCompetitor(startLocation);
    return competitor?.getPoolUser();
  }

  linkToPoolUser(place: Place, gameRound: GameRound | undefined): void {
    const poolUser = this.getPoolUser(place);
    if (poolUser == undefined) {
      throw new Error('could not find pooluser');
    }

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
class ScoreMap extends Map<string, GameRoundMap> {

}