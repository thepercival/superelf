import { GameState, Period } from 'ngx-sport';
import { ViewPeriod } from './periods/viewPeriod';

export class GameRound {
  public readonly totalNrOfGames: number;
  public readonly state: GameState;

  constructor(
    public readonly viewPeriod: ViewPeriod,
    public readonly number: number,
    public readonly period: Period,
    public readonly created: number,
    public readonly inProgress: number,
    public readonly finished: number
  ) {
    this.totalNrOfGames = created + inProgress + finished
    if( this.inProgress > 0 || ( this.created > 0 && this.finished > 0 ) ) {
      this.state = GameState.InProgress;
    } else if( this.finished > 0) {
      this.state = GameState.Finished;
    } else {
      this.state = GameState.Created;    
    }
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