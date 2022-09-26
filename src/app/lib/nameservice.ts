import { Injectable } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { LeagueName } from './leagueName';
import { FootballScore } from './score';

@Injectable({
    providedIn: 'root'
})
export class SuperElfNameService {
    constructor() {
    }

    getLineName(lineDef: number): string {
        if (lineDef === FootballLine.GoalKeeper) {
            return 'keeper';
        } else if (lineDef === FootballLine.Defense) {
            return 'verdediging';
        } else if (lineDef === FootballLine.Midfield) {
            return 'middenveld';
        } else if (lineDef === FootballLine.Forward) {
            return 'aanval';
        }
        return 'alle linies';
    }

    getScoreName(score: FootballScore): string {
        switch (score) {
            case FootballScore.WinResult:
                return 'gewonnen';
            case FootballScore.DrawResult:
                return 'gelijk';
            case FootballScore.Goal:
                return 'goal';
            case FootballScore.Assist:
                return 'assist';
            case FootballScore.PenaltyGoal:
                return 'penalty';
            case FootballScore.OwnGoal:
                return 'eigen goal';
            case FootballScore.CleanSheet:
                return 'geen tegengoals';
            case FootballScore.SpottySheet:
                return 'te veel tegengoals';
            case FootballScore.YellowCard:
                return 'gele kaart';
            case FootballScore.RedCard:
                return 'rode kaart';
        }
        return '?';
    }

    getLeagueName(leagueName: LeagueName): string {
        switch (leagueName) {
            case LeagueName.Competition:
                return 'competitie';
            case LeagueName.Cup:
                return 'beker';
            case LeagueName.SuperCup:
                return 'super cup';
        }
        return '?';
    }
}
