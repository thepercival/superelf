import { PersonStats } from '../mapper';

export interface JsonGameRoundStats {
    gameRoundNumber: number;
    detailedPoints: PersonStats;
}