import { concatMap, Observable, of } from "rxjs";
import { CompetitionConfig } from "../competitionConfig";
import { ViewPeriod } from "../periods/viewPeriod";
import { GameRoundRepository } from "./repository";
import { GameRound } from "../gameRound";
import { GameRoundViewType } from "./viewType";
import { ViewPeriodGameRoundMap } from "./viewPeriodGameRoundMap";

export class GameRoundGetter {
  // viewPeriod and gameRoundNr indexes
  private gameRoundsMaps: Map<number, ViewPeriodGameRoundMap> = new Map();

  // = new Map(
  //     gameRounds.map((gr) => [gr.number, gr])
  //   );

  constructor(private gameRoundRepository: GameRoundRepository) {}

  public getGameRounds(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): Observable<GameRound[]> {
    return this.getViewPeriodGameRoundMap(competitionConfig, viewPeriod).pipe(
      concatMap((gameRoundMap: ViewPeriodGameRoundMap) => {
        return of(Array.from(gameRoundMap.values()));
      })
    );
  }

  public getViewPeriodGameRoundMap(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): Observable<ViewPeriodGameRoundMap> {
    const gameRoundMap = this.gameRoundsMaps.get(viewPeriod.getId());
    if (gameRoundMap !== undefined) {
      return of(gameRoundMap);
    }
    return this.gameRoundRepository
      .getObjects(competitionConfig, viewPeriod)
      .pipe(
        concatMap((gameRounds: GameRound[]) => {
          const gameRoundMap = new ViewPeriodGameRoundMap(
            viewPeriod, new Map(gameRounds.map((gr) => [gr.number, gr]))
          );
          this.gameRoundsMaps.set(viewPeriod.getId(), gameRoundMap);
          return of(gameRoundMap);
        })
      );
  }


  public getGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    gameRoundNr: number
  ): Observable<GameRound> {
    return this.getViewPeriodGameRoundMap(competitionConfig, viewPeriod).pipe(
      concatMap((gameRoundMap: ViewPeriodGameRoundMap) => {
        const gameRound = gameRoundMap.get(gameRoundNr);
        if (gameRound === undefined) {
          throw new Error("gameround not found");
        }
        return of(gameRound);
      })
    );
  }

  public getPreviousGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    gameRound: GameRound
  ): Observable<GameRound | undefined> {
    return this.getGameRounds(competitionConfig, viewPeriod).pipe(
      concatMap((gameRounds: GameRound[]) => {
        const idx = gameRounds.findIndex((g: GameRound) => g === gameRound);
        if (idx <= 0) {
          return of(undefined);
        }
        return of(gameRounds.splice(idx - 1, 1).pop());
      })
    );
  }

  public getNextGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    gameRound: GameRound
  ): Observable<GameRound | undefined> {
    return this.getGameRounds(competitionConfig, viewPeriod).pipe(
      concatMap((gameRounds: GameRound[]) => {
        // console.log("gameroundgetter->getNextGR", gameRounds);
        const idx = gameRounds.findIndex((g) => g === gameRound);
        if (idx >= gameRounds.length - 1) {
          return of(undefined);
        }
        return of(gameRounds.splice(idx + 1, 1).pop());
      })
    );
  }

  getActiveViewGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    viewType: GameRoundViewType
  ): Observable<GameRound|undefined> {
    return this.getViewPeriodGameRoundMap(competitionConfig, viewPeriod).pipe(
      concatMap((gameRoundMap: Map<number, GameRound>): Observable<GameRound|undefined> => {
        return this.gameRoundRepository
          .getActiveViewGameRound(competitionConfig, viewPeriod, viewType)
          .pipe(
            concatMap((activeGameRound: GameRound): Observable<GameRound | undefined> => {
              const gameRound: GameRound|undefined = gameRoundMap.get(activeGameRound.number);
              return of(gameRound);
            })
          );
      })
    );
    
  }

  // public calculateFinished(
  //   competitionConfig: CompetitionConfig,
  //   viewPeriod: ViewPeriod,
  //   defaultGameRoundNr: number | undefined
  // ): Observable<GameRound> {
  //   if (defaultGameRoundNr !== undefined && defaultGameRoundNr > 0) {
  //     return of(viewPeriod.getGameRound(defaultGameRoundNr));
  //   }

  // calculateCurrentSourceGameRoundNumber(togetherGames: TogetherGame[]): number {
  //   const lastFinished = togetherGames
  //     .slice()
  //     .reverse()
  //     .find((game: TogetherGame) => game.getState() === GameState.Finished);
  //   let grLastFinished: number | undefined = lastFinished
  //     ?.getTogetherPlaces()[0]
  //     .getGameRoundNumber();

  //   const lastInPogress = togetherGames
  //     .reverse()
  //     .find((game: TogetherGame) => game.getState() === GameState.InProgress);
  //   let grLastInPogress: number | undefined = lastInPogress
  //     ?.getTogetherPlaces()[0]
  //     .getGameRoundNumber();

  //   const lastCreated = togetherGames
  //     .reverse()
  //     .find((game: TogetherGame) => game.getState() === GameState.Created);
  //   let grLastCreated: number | undefined = lastCreated
  //     ?.getTogetherPlaces()[0]
  //     .getGameRoundNumber();

  //   // wanneer een gr in progress
  //   if (grLastInPogress !== undefined) {
  //     // wanneer er een recentere finished na komt
  //     if (grLastFinished !== undefined && grLastFinished > grLastInPogress) {
  //       return grLastFinished;
  //     }
  //     return grLastInPogress;
  //   }
  //   // pak de meest recente finish
  //   if (grLastFinished !== undefined) {
  //     return grLastFinished;
  //   }
  //   if (grLastCreated !== undefined) {
  //     return grLastCreated;
  //   }
  //   throw new Error("should be a gameroundnumber");
  // }
  // }
}