import { concatMap, Observable, of } from "rxjs";
import { AgainstGame, Poule } from "ngx-sport";
import { GameRepository } from "../ngx-sport/game/repository";
import { GameRound } from "../gameRound";
import { ViewPeriod } from "../periods/viewPeriod";

export class SourceAgainstGamesGetter {
  private gameRoundsGamesMaps: Map<
    string | number,
    Map<number, AgainstGame[]>
  > = new Map();

  constructor(private gameRepository: GameRepository) {}

  public getGameRoundGames(
    poule: Poule,
    gameRound: GameRound
  ): Observable<AgainstGame[]> {
    const againstGamesMap = this.getGameRoundsMap(poule, gameRound.viewPeriod);
    const againstGames = againstGamesMap.get(gameRound.number);
    if (againstGames !== undefined) {
      return of(againstGames);
    }

    return this.gameRepository.getSourceObjects(poule, gameRound.number).pipe(
      concatMap((againstGames: AgainstGame[]) => {
        againstGamesMap.set(gameRound.number, againstGames);
        return of(againstGames);
      })
    );
  }

  private getGameRoundsMap(
    sourcePoule: Poule,
    viewPeriod: ViewPeriod
  ): Map<number, AgainstGame[]> {
    const index: string = this.getMainIndex(sourcePoule, viewPeriod);
    let gamesMap = this.gameRoundsGamesMaps.get(index);
    if (gamesMap !== undefined) {
      return gamesMap;
    }
    gamesMap = new Map();
    this.gameRoundsGamesMaps.set(index, gamesMap);
    return gamesMap;
  }

  private getMainIndex(sourcePoule: Poule, viewPeriod: ViewPeriod): string {
    return sourcePoule.getId() + "-" + viewPeriod.getId();
  }
}