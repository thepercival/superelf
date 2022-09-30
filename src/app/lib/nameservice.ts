import { Injectable } from '@angular/core';
import { AgainstGame, FootballLine, GameState, ScoreConfigService } from 'ngx-sport';
import { LeagueName } from './leagueName';
import { FootballScore } from './score';

@Injectable({
    providedIn: 'root'
})
export class SuperElfNameService {

    private scoreConfigService: ScoreConfigService;

    constructor() {
        this.scoreConfigService = new ScoreConfigService();
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

    getAgainstScore(againstGame: AgainstGame): string {
        if (againstGame.getState() !== GameState.Finished) {
            return ' vs ';
        }
        const score = ' - ';
        const finalScore = this.scoreConfigService.getFinalAgainstScore(againstGame);
        if (finalScore === undefined) {
            return score;
        }
        return finalScore.getHome() + score + finalScore.getAway();
    }
}
