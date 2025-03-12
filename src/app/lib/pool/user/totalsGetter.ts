import { concatMap, Observable, of } from "rxjs";
import { GameRound } from "../../gameRound";
import { Pool } from "../../pool";
import { GameRoundTotalsMap, PoolTotalsRepository, PoolUsersTotalsMap } from "../../totals/repository";

export class PoolUsersTotalsGetter {
  public gameRoundTotalsMap: GameRoundTotalsMap = new GameRoundTotalsMap();

  constructor(private poolTotalsRepository: PoolTotalsRepository) {}

  // PoolUsersTotals
  public getPoolUserTotals(
    pool: Pool,
    gameRound: GameRound
  ): Observable<PoolUsersTotalsMap> {
    const gameRoundIndex: string = this.getGameRoundIndex(gameRound);
    const gameRoundTotalsMap: PoolUsersTotalsMap | undefined =
      this.gameRoundTotalsMap.get(gameRoundIndex);
    if (gameRoundTotalsMap !== undefined) {
      return of(gameRoundTotalsMap);
    }
    return this.poolTotalsRepository
      .getGameRoundPoolUsersMap(pool, gameRound)
      .pipe(
        concatMap((gameRoundPoolUsersTotals: PoolUsersTotalsMap) => {
          this.gameRoundTotalsMap.set(gameRoundIndex, gameRoundPoolUsersTotals);
          return of(gameRoundPoolUsersTotals);
        })
      );
  }

  private getGameRoundIndex(gameRound: GameRound): string {
    return gameRound.viewPeriod.getId() + "-" + gameRound.number;
  }
}