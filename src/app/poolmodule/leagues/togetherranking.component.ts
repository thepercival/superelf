import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Poule, GameAmountConfig, GameState, ScoreConfigService, TogetherGame, CompetitionSport, TogetherGamePlace, TogetherSportRoundRankingCalculator, SportRoundRankingItem, PlaceLocation, Place, AgainstGpp, AgainstH2h, Single, AllInOneGame, StartLocationMap, StructureNameService } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { PoolCompetitor } from '../../lib/pool/competitor';
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
  public processing = true;

  constructor(
    private scoreConfigService: ScoreConfigService,
    private router: Router,
    private cssService: CSSService) {
  }

  ngOnInit() {
    this.processing = true;
    this.structureNameService = new StructureNameService(this.startLocationMap);
    this.togetherRankingCalculator = new TogetherSportRoundRankingCalculator(this.competitionSport, [GameState.InProgress, GameState.Finished]);
    this.sportRankingItems = this.togetherRankingCalculator.getItemsForPoule(this.poule);
    this.gameAmountConfig = this.poule.getRound().getNumber().getValidGameAmountConfig(this.competitionSport);
    //this.initGameRoundMap();    
    this.initTableData();
    // console.log(this.startLocationMap);
    this.processing = false;
  }


  /**
   * door door games en plaats elke gameplace ergens in een map
   * 
   * je wilt per deelnemer door de gamerounds lopen en dan per gameRound wil je score weten
   */
  initTableData() {

    this.poule.getPlaces().forEach((place: Place) => {
      this.scoreMap.set(place.getRoundLocationId(), {});
    });

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

  getGameRounds(): number[] {
    // const gameRounds: number[] = [];
    // const iterator = (new Array(this.gameAmountConfig.getAmount())).keys();
    // for (const key of iterator) {
    //   gameRounds.push(1 + key);
    // }
    // console.log('gameRounds', gameRounds);
    return [6]; // gameRounds;
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

  getQualifyPlaceClass(rankingItem: SportRoundRankingItem): string {
    const place = this.poule.getPlace(rankingItem.getUniqueRank());
    // console.log('place', place, place ? this.cssService.getQualifyPlace(place) : '');
    return this.getQualifyPlaceCSS(rankingItem.getUniqueRank());
  }

  getQualifyPlaceCSS(uniqueRank: number): string {
    return uniqueRank <= 2 ? 'text-bg-success' : 'text-black';
  }

  navigateToPoolUser(place: Place, gameRound: GameRound | undefined): void {
    const startLocation = place.getStartLocation();
    if (startLocation === undefined) {
      return;
    }
    const competitor = <PoolCompetitor>this.startLocationMap.getCompetitor(startLocation);
    if (competitor == undefined) {
      return;
    }
    const poolUser = competitor.getPoolUser();

    this.router.navigate(['/pool/user', poolUser.getPool().getId(), poolUser.getId(), gameRound ? gameRound.getNumber() : 0]);
  }

  // getViewRange(viewport: number): VoetbalRange {
  //   return { min: this.activeGameRound - (viewport - 1), max: this.activeGameRound };
  // }

  // nrOfColumnsPerViewport: ViewPortColumns = { xs: 2, sm: 5, md: 10, lg: 15, xl: 30 };

  // useSubScore() {
  //   return this.poule.getRound().getNumber().getValidScoreConfigs().some(scoreConfig => {
  //     return scoreConfig.useSubScore();
  //   });
  // }
}


interface GameRoundMap {
  [key: number]: number;
}
class ScoreMap extends Map<string, GameRoundMap> {

}