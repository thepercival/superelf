import { PoolCompetitor } from "../../pool/competitor";

export interface GameRoundsPoints {
  number: number;
  points: number;
}

export interface CompetitorWithGameRoundsPoints {
  rank: number;
  competitor: PoolCompetitor;
  gameRoundsPoints: GameRoundsPoints[];
  viewPeriodsPoints: number;
}