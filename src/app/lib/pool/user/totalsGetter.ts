import { concatMap, Observable, of } from "rxjs";
import { GameRound } from "../../gameRound";
import { Pool } from "../../pool";
import { GameRoundTotalsMap, PoolTotalsRepository, PoolUsersTotalsMap } from "../../totals/repository";
import { ViewPeriod } from "../../periods/viewPeriod";

export class PoolUsersTotalsGetter {
  public gameRoundTotalsMap: GameRoundTotalsMap = new GameRoundTotalsMap();
  public viewPeriodTotalsMap: Map<number, PoolUsersTotalsMap> = new Map();

  constructor(private poolTotalsRepository: PoolTotalsRepository) {}

  public getGameRoundTotals(
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

  public getViewPeriodTotals(
    pool: Pool,
    viewPeriod: ViewPeriod
  ): Observable<PoolUsersTotalsMap> {
    const viewPeriodTotals: PoolUsersTotalsMap | undefined =
      this.viewPeriodTotalsMap.get(viewPeriod.getId());
    if (viewPeriodTotals !== undefined) {
      return of(viewPeriodTotals);
    }
    return this.poolTotalsRepository
      .getViewPeriodPoolUsersMap(pool, viewPeriod)
      .pipe(
        concatMap((viewPeriodTotalsTmp: PoolUsersTotalsMap) => {
          this.viewPeriodTotalsMap.set(viewPeriod.getId(), viewPeriodTotalsTmp);
          return of(viewPeriodTotalsTmp);
        })
      );
  }
}


  //   this.poolTotalsRepository
  //     .(pool, assembleViewPeriod)
  //     .subscribe({
  //       next: (assemblePoolUsersTotalsMap: PoolUsersTotalsMap) => {
  //         this.poolUsersTotalsMap = assemblePoolUsersTotalsMap;