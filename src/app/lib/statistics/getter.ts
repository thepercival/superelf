import { GameState } from "ngx-sport";
import { BadgeCategory } from "../achievement/badge/category";
import { S11Formation } from "../formation";
import { S11FormationLine } from "../formation/line";
import { S11FormationPlace } from "../formation/place";
import { GameRound } from "../gameRound";
import { S11Player } from "../player";
import { Statistics } from "../statistics";


export class StatisticsGetter {
  constructor() {}

  public personMap: Map<string | number, StatisticsMap> = new Map();

  // protected readonly substituteAppearances: Map<number, boolean>


  getFormationGameRoundPoints(
    formation: S11Formation,
    gameRound: GameRound,
    badgeCategory: BadgeCategory | undefined
  ): number {
    let points = 0;
    for (let line of formation.getLines()) {
      points += this.getFormationLineGameRoundPoints(
        line,
        gameRound,
        badgeCategory
      );
    }
    return points;
  }

  getFormationLineGameRoundPoints(
    formationLine: S11FormationLine,
    gameRound: GameRound,
    badgeCategory: BadgeCategory | undefined
  ): number {
    let points = 0;
    for (let place of formationLine.getPlaces()) {
      points += this.getFormationPlaceGameRoundPoints(
        place,
        gameRound,
        badgeCategory
      );
    }
    return points;
  }

  getFormationPlaceGameRoundPoints(
    formationPlace: S11FormationPlace,
    gameRound: GameRound,
    badgeCategory: BadgeCategory | undefined
  ): number {
    const player = formationPlace.getPlayer();
    if (player === undefined) {
      return 0;
    }

    const statistics = this.getStatistics(player, gameRound.number);
    if (statistics === undefined) {
      return 0;
    }
    const formationLine = formationPlace.getFormationLine();
    if (
      formationPlace.isSubstitute() &&
      !this.isSubstituteUsed(formationPlace, gameRound)
    ) {
      return 0;
    }
    const scorePointsMap = formationLine
      .getFormation()
      .getPoolUser()
      .getPool()
      .getCompetitionConfig()
      .getScorePointsMap();
    return statistics.getPoints(
      formationPlace.getLine(),
      scorePointsMap,
      badgeCategory
    );
  }

  isSubstituteUsed(formationPlace: S11FormationPlace,gameRound: GameRound): boolean {
    if (formationPlace === undefined || !formationPlace.isSubstitute()) {
      return false;
    }
    const player = formationPlace.getPlayer();
    if (player === undefined) {
      return false;
    }
    const statistics = this.getStatistics(player, gameRound.number);
    if (statistics === undefined) {
      return false;
    }
    const formationLine = formationPlace.getFormationLine();
    return this.shouldSubstituteAppear(formationLine,gameRound) === true;
  }


    // public canSubstituteAppear(gameRound: GameRound): GameState {
    //     const finishedPlaces = this.getStartingPlaces().filter((formationPlace: S11FormationPlace): boolean => {
    //         return formationPlace.getPlayer()?.getGameStatistics(gameRound.getNumber()) !== undefined;
    //     });

    //     if (finishedPlaces.length === this.getStartingPlaces().length) {
    //         return GameState.Finished;
    //     }
    //     if (finishedPlaces.length > 0) {
    //         return GameState.InProgress;
    //     }
    //     return GameState.Created;
    // }

    
    

  hasAppeared(formationPlace: S11FormationPlace | undefined,gameRound?: GameRound | undefined): boolean {
    if (formationPlace === undefined) {
      return false;
    }    
    const formationLine = formationPlace.getFormationLine();
    const s11Player = formationPlace.getPlayer();
    if (s11Player === undefined) {
      return false;
    }
    if (gameRound === undefined) {
      return s11Player.hasAppeared();
    }
  
    if (formationPlace.isSubstitute() && this.shouldSubstituteAppear(formationLine, gameRound) !== true ) {
      return false;
    }

    return this.getStatistics(s11Player, gameRound.number)?.hasAppeared() === true;
  }

  public areStartingPlacesFinished(formationLine: S11FormationLine,gameRound: GameRound): boolean {
    const appearedPlaces = formationLine
      .getStartingPlaces()
      .filter((formationPlace: S11FormationPlace): boolean => {
        const s11Player = formationPlace.getPlayer();
        if (s11Player === undefined) {
          return false;
        }
        return this.getStatistics(s11Player, gameRound.number) !== undefined;
      });

    return appearedPlaces.length === formationLine.getStartingPlaces().length
  }

  

  public shouldSubstituteAppear(
      formationLine: S11FormationLine, 
      gameRound: GameRound
    ): boolean|undefined {             

      if( formationLine.getStartingPlaces().some((startingPlace: S11FormationPlace): boolean => {
        const s11Player = startingPlace.getPlayer();
        if( s11Player === undefined) {
          return false;
        }
        const stats = this.getStatistics(s11Player, gameRound.number);
        return stats !== undefined && !stats.hasAppeared();
      })) {        
        return true;
      }

      if( !this.areStartingPlacesFinished(formationLine,gameRound)){ 
        return undefined;
      }
      return false;

      // }
        // hier ben je dus per formatie(person) een map nodig per wedstrijdronde en per line

        // if (gameRound === undefined) {
        //     return this.substituteAppearances.size > 0;
        // }
        // const gameRoundNr = gameRound instanceof GameRound ? gameRound.number : gameRound;
        // // console.log(this.getNumber(), this.substituteAppearances.has(gameRound.getNumber()));
        // return this.substituteAppearances.has(gameRoundNr);
    }

  // private playerHasStatistics(
  //   s11Player: S11Player,
  //   gameRoundNr: number
  // ): boolean {
  //   return this.getStatistics(s11Player, gameRoundNr) !== undefined;
  // }

  // public hasSomeStatistics(): boolean {
  //     return this.statistics !== undefined && this.statistics.size > 0;
  // }

  public getStatistics(
    s11Player: S11Player,
    gameRoundNr: number
  ): Statistics | undefined {
    const gameRoundStatsMap = this.personMap.get(
      +s11Player.getPerson().getId()
    );
    if (gameRoundStatsMap === undefined) {
      return undefined;
    }
    return gameRoundStatsMap.get(gameRoundNr);
  }

  public addStatistics(
    gameRound: GameRound | number,
    personId: string | number,
    statistics: Statistics
  ): void {
    const gameRoundNr =
      gameRound instanceof GameRound ? gameRound.number : gameRound;
    let gameRoundStatsMap = this.personMap.get(personId);
    if (gameRoundStatsMap === undefined) {
      gameRoundStatsMap = new StatisticsMap();
      this.personMap.set(personId, gameRoundStatsMap);
    }
    gameRoundStatsMap.set(gameRoundNr, statistics);
  }
}

export class StatisticsMap extends Map<number, Statistics> { }
