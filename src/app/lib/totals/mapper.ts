import { Injectable } from '@angular/core';
import { Totals } from '../totals';
import { JsonTotals } from './json';

@Injectable({
    providedIn: 'root'
})
export class TotalsMapper {
    constructor() { }

    toObject(json: JsonTotals): Totals {
        return new Totals(
            json.nrOfWins,
            json.nrOfDraws,
            json.nrOfTimesStarted,
            json.nrOfTimesSubstituted,
            json.nrOfTimesSubstitute,
            json.nrOfTimesNotAppeared,
            json.nrOfFieldGoals,
            json.nrOfAssists,
            json.nrOfPenalties,
            json.nrOfOwnGoals,
            json.nrOfCleanSheets,
            json.nrOfSpottySheets,
            json.nrOfYellowCards,
            json.nrOfRedCards
        );
    }

    toJson(totals: Totals): JsonTotals {
        return {
            nrOfWins: totals.getNrOfWins(),
            nrOfDraws: totals.getNrOfDraws(),
            nrOfTimesStarted: totals.getNrOfTimesStarted(),
            nrOfTimesSubstituted: totals.getNrOfTimesSubstituted(),
            nrOfTimesSubstitute: totals.getNrOfTimesSubstitute(),
            nrOfTimesNotAppeared: totals.getNrOfTimesNotAppeared(),
            nrOfFieldGoals: totals.getNrOfFieldGoals(),
            nrOfAssists: totals.getNrOfAssists(),
            nrOfPenalties: totals.getNrOfPenalties(),
            nrOfOwnGoals: totals.getNrOfOwnGoals(),
            nrOfCleanSheets: totals.getNrOfCleanSheets(),
            nrOfSpottySheets: totals.getNrOfSpottySheets(),
            nrOfYellowCards: totals.getNrOfYellowCards(),
            nrOfRedCards: totals.getNrOfRedCards()
        };
    }
}
