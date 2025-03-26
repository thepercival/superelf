import { concatMap, Observable, of } from "rxjs";
import { AgainstGame, Poule } from "ngx-sport";
import { GameRepository } from "../ngx-sport/game/repository";

export class SourceAgainstGamesGetter {
  private gameRoundsGamesMaps: Map<
    string | number,
    Map<number, AgainstGame[]>
  > = new Map();

  constructor(
    private gameRepository: GameRepository
  ) {
  }

  public getGameRoundGames(
    poule: Poule,
    gameRoundNr: number
  ): Observable<AgainstGame[]> {
    const againstGamesMap = this.getGameRoundsMap(poule);
    const againstGames = againstGamesMap.get(gameRoundNr);
    if (againstGames !== undefined) {
      return of(againstGames);
    }

    return this.gameRepository.getSourceObjects(poule, gameRoundNr).pipe(
      concatMap((againstGames: AgainstGame[]) => {
        againstGamesMap.set(gameRoundNr, againstGames);
        return of(againstGames);
      })
    );
  }

  private getGameRoundsMap(poule: Poule): Map<number, AgainstGame[]> {
    let gamesMap = this.gameRoundsGamesMaps.get(poule.getId());
    if (gamesMap !== undefined) {
      return gamesMap;
    }
    gamesMap = new Map();
    this.gameRoundsGamesMaps.set(poule.getId(), gamesMap);
    return gamesMap;
  }
}