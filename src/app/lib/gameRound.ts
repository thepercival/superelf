import { Period } from 'ngx-sport';
import { ViewPeriod } from './periods/viewPeriod';

export class GameRound {
  public readonly totalNrOfGames: number;

  constructor(
    public readonly viewPeriod: ViewPeriod,
    public readonly number: number,
    public readonly period: Period,
    public readonly created: number,
    public readonly inProgress: number,
    public readonly finished: number
  ) {
    this.totalNrOfGames = created + inProgress + finished
  }

  //   protected againstGames: AgainstGame[] | undefined;

  // public hasAgainstGames(): boolean {
  //     return this.againstGames !== undefined && this.againstGames.length > 0;
  // }

  // public getAgainstGames(): AgainstGame[] {
  //     if (this.againstGames === undefined) {
  //         throw new Error('gameround has uninitialized againstgames');
  //     }
  //     return this.againstGames;
  // }

  // public setAgainstGames(againstGames: AgainstGame[]): void {
  //     this.againstGames = againstGames;
  //     const dates = this.againstGames.map((againstGame: AgainstGame): number => againstGame.getStartDateTime().getTime() );
  //     this.period = new Period(new Date(Math.min(...dates)), new Date(Math.max(...dates)));
  // }

  public getPeriod(): Period | undefined {
    return this.period;
  }
}