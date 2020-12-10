import { JsonGameRoundScore } from '../../../../gameRound/score/json';

export interface JsonViewPeriodPersonGameRoundScore extends JsonGameRoundScore {
    stats: Map<number, number | boolean>
}