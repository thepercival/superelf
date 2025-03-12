import { concatMap, map, Observable, of } from "rxjs";
import { CompetitionConfig } from "../competitionConfig";
import { ViewPeriod } from "../periods/viewPeriod";
import { CurrentGameRoundNumbers, GameRoundRepository } from "./repository";
import { GameRoundRange } from "./range";
import { GameRound } from "../gameRound";
import { GameRoundViewType } from "./viewType";

export class GameRoundGetter {
  private gameRoundsMaps: Map<number, Map<number, GameRound>> = new Map();

  // = new Map(
  //     gameRounds.map((gr) => [gr.number, gr])
  //   );

  constructor(private gameRoundRepository: GameRoundRepository) {}

  public getGameRounds(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): Observable<GameRound[]> {
    return this.getGameRoundMap(competitionConfig, viewPeriod).pipe(
      concatMap((gameRoundMap: Map<number, GameRound>) => {
        return of(Array.from(gameRoundMap.values()));
      })
    );
  }

  public getGameRoundMap(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): Observable<Map<number, GameRound>> {
    const gameRoundMap = this.gameRoundsMaps.get(viewPeriod.getId());
    if (gameRoundMap !== undefined) {
      return of(gameRoundMap);
    }
    return this.gameRoundRepository
      .getObjects(competitionConfig, viewPeriod)
      .pipe(
        concatMap((gameRounds: GameRound[]) => {
          const gameRoundMap = new Map(gameRounds.map((gr) => [gr.number, gr]));;
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
    return this.getGameRoundMap(competitionConfig, viewPeriod).pipe(
      concatMap((gameRoundMap: Map<number, GameRound>) => {
        const gameRound = gameRoundMap.get(gameRoundNr);
        if (gameRound === undefined) {
          throw new Error("gameround not found");
        }
        return of(gameRound);
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