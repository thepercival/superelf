import { concatMap, Observable, of } from "rxjs";
import { CompetitionConfig } from "../competitionConfig";
import { ViewPeriod } from "../periods/viewPeriod";
import { GameRoundViewType } from "./viewType";
import { GameRoundGetter } from "./gameRoundGetter";
import { ViewPeriodGameRoundMap } from "./viewPeriodGameRoundMap";
import { GameRound } from "../gameRound";

export class ActiveViewGameRoundsCalculator {  

  constructor(
    private gameRoundGetter: GameRoundGetter) {
    
  }

  public getActiveViewGameRounds(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    activeViewGameRound: GameRound,
    nrOfGamesBefore: number,
    nrOfGamesAfter: number
  ): Observable<GameRound[]> {
    if (nrOfGamesBefore < 0 || nrOfGamesAfter < 0) {
      throw new Error();
    }

    return this.gameRoundGetter
      .getViewPeriodGameRoundMap(competitionConfig, viewPeriod)
      .pipe(
        concatMap((gameRoundMap: ViewPeriodGameRoundMap) => {
          const gameRounds = Array.from(gameRoundMap.values());
          const minGameRoundNr: number = Math.min(
            ...gameRounds.map((gameRound) => gameRound.number)
          );
          const maxGameRoundNr: number = Math.max(
            ...gameRounds.map((gameRound) => gameRound.number)
          );

          const gameRoundsBefore = [];
          const gameRoundsAfter = [];
          const activeGameRoundNr = activeViewGameRound.number;

          let deltaAfter = 1;
          while (
            gameRoundsAfter.length < nrOfGamesAfter &&
            activeGameRoundNr + deltaAfter <= maxGameRoundNr
          ) {
            const gameRoundAfter = gameRoundMap.get(
              activeGameRoundNr + deltaAfter
            );
            if (gameRoundAfter) {
              gameRoundsAfter.push(gameRoundAfter);
            }
            deltaAfter++;
          }

          const nrOfGamesAfterShortage =
            nrOfGamesAfter - gameRoundsAfter.length;

          let deltaBefore = 1;
          while (
            gameRoundsBefore.length <
              nrOfGamesBefore + nrOfGamesAfterShortage &&
            activeGameRoundNr - deltaBefore >= minGameRoundNr
          ) {
            const gameRoundBefore = gameRoundMap.get(
              activeGameRoundNr - deltaBefore
            );
            if (gameRoundBefore) {
              gameRoundsBefore.push(gameRoundBefore);
            }
            deltaBefore++;
          }

          if (deltaAfter === 1) {
            const nrOfGamesBeforeShortage =
              nrOfGamesBefore - gameRoundsBefore.length;
            while (
              gameRoundsAfter.length <
                nrOfGamesAfter + nrOfGamesBeforeShortage &&
              activeGameRoundNr + deltaAfter <= maxGameRoundNr
            ) {
              const gameRoundAfter = gameRoundMap.get(
                activeGameRoundNr + deltaAfter
              );
              if (gameRoundAfter) {
                gameRoundsAfter.push(gameRoundAfter);
              }
              deltaAfter++;
            }
          }

          return of(
            gameRoundsBefore.concat([activeViewGameRound], gameRoundsAfter)
          );
        })
      );
  }

  public determineActiveViewGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    viewType: GameRoundViewType
  ): Observable<GameRound> {
    return this.gameRoundGetter
      .getActiveViewGameRound(competitionConfig, viewPeriod, viewType)
      .pipe(
        concatMap((gameRound: GameRound | undefined) => {
          if (gameRound === undefined) {
            throw new Error("active gameround could not be determined");
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
    return this.gameRoundGetter.getPreviousGameRound(
      competitionConfig,
      viewPeriod,
      gameRound
    );
  }

  public getNextGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    gameRound: GameRound
  ): Observable<GameRound | undefined> {
    return this.gameRoundGetter.getNextGameRound(
      competitionConfig,
      viewPeriod,
      gameRound
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