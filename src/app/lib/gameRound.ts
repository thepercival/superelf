import { GameState, Period } from 'ngx-sport';
import { ViewPeriod } from './periods/viewPeriod';

export class GameRound {

  constructor(
    public readonly viewPeriod: ViewPeriod,
    public readonly number: number,
    public readonly period: Period,
    public readonly state: GameState,    
    public readonly created: number,
    public readonly inProgress: number,
    public readonly finished: number,
    public readonly totalNrOfGames: number
  ) {
     
  }

  public getPeriod(): Period | undefined {
    return this.period;
  }
}