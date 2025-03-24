import { concatMap, map, Observable, of } from "rxjs";
import { CompetitionConfig } from "../competitionConfig";
import { ViewPeriod } from "../periods/viewPeriod";
import { CurrentGameRoundNumbers, GameRoundRepository } from "./repository";
import { GameRoundRange } from "./range";
import { GameRound } from "../gameRound";
import { GameRoundViewType } from "./viewType";
import { GameRoundGetter } from "./gameRoundGetter";

export class ActiveGameRoundsCalculator {
  private gameRoundGetter: GameRoundGetter;

  // = new Map(
  //     gameRounds.map((gr) => [gr.number, gr])
  //   );

  constructor(
    public readonly nrOfGamesBefore: number,
    private readonly nrOfGamesAfter: number,
    readonly gameRoundRepository: GameRoundRepository
  ) {
    if (nrOfGamesBefore < 0 || nrOfGamesAfter < 0) {
      throw new Error();
    }
    this.gameRoundGetter = new GameRoundGetter(gameRoundRepository);
  }

  public getActiveGameRounds(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    activeGameRound: GameRound
  ): Observable<GameRound[]> {
    return this.gameRoundGetter
      .getGameRoundMap(competitionConfig, viewPeriod)
      .pipe(
        concatMap((gameRoundMap: Map<number, GameRound>) => {
          const gameRounds = Array.from(gameRoundMap.values());
          const minGameRoundNr: number = Math.min(
            ...gameRounds.map((gameRound) => gameRound.number)
          );
          const maxGameRoundNr: number = Math.max(
            ...gameRounds.map((gameRound) => gameRound.number)
          );

          const gameRoundsBefore = [];
          const gameRoundsAfter = [];

          let deltaAfter = 1;
          while (
            gameRoundsAfter.length < this.nrOfGamesAfter &&
            activeGameRound.number + deltaAfter <= maxGameRoundNr
          ) {
            const gameRoundAfter = gameRoundMap.get(
              activeGameRound.number + deltaAfter
            );
            if (gameRoundAfter) {
              gameRoundsAfter.push(gameRoundAfter);
            }
            deltaAfter++;
          }

          const nrOfGamesAfterShortage =
            this.nrOfGamesAfter - gameRoundsAfter.length;
          const nrOfGamesBefore = this.nrOfGamesBefore + nrOfGamesAfterShortage;

          let deltaBefore = 1;
          while (
            gameRoundsBefore.length < this.nrOfGamesBefore &&
            activeGameRound.number - deltaBefore >= minGameRoundNr
          ) {
            const gameRoundBefore = gameRoundMap.get(
              activeGameRound.number - deltaBefore
            );
            if (gameRoundBefore) {
              gameRoundsBefore.push(gameRoundBefore);
            }
            deltaBefore++;
          }

          if (deltaAfter === 1) {
            const nrOfGamesBeforeShortage =
              nrOfGamesBefore - gameRoundsBefore.length;
            const nrOfGamesAfter =
              this.nrOfGamesAfter + nrOfGamesBeforeShortage;

            while (
              gameRoundsAfter.length < nrOfGamesAfter &&
              activeGameRound.number + deltaAfter <= maxGameRoundNr
            ) {
              const gameRoundAfter = gameRoundMap.get(
                activeGameRound.number + deltaAfter
              );
              if (gameRoundAfter) {
                gameRoundsAfter.push(gameRoundAfter);
              }
              deltaAfter++;
            }
          }

          return of(
            gameRoundsBefore.concat([activeGameRound], gameRoundsAfter)
          );
        })
      );
  }

  public determineActiveGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    viewType: GameRoundViewType
  ): Observable<GameRound> {
    return this.gameRoundGetter
      .getGameRoundMap(competitionConfig, viewPeriod)
      .pipe(
        concatMap((gameRoundMap: Map<number, GameRound>) => {
          return this.gameRoundRepository
            .getActive(competitionConfig, viewPeriod, viewType)
            .pipe(
              concatMap((activeGameRoundNr: number) => {
                const activeGameRound = gameRoundMap.get(activeGameRoundNr);
                if (activeGameRound === undefined) {
                  throw new Error("gameRound not found");
                }
                return of(activeGameRound);
              })
            );
        })
      );
  }

  public getPreviousGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    gameRound: GameRound
  ): Observable<GameRound | undefined> {
    return this.gameRoundGetter.getPreviousGameRound(competitionConfig, viewPeriod, gameRound);
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