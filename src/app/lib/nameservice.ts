import { Injectable } from '@angular/core';
import { AgainstGame, Competition, FootballLine, GameState, ScoreConfigService } from 'ngx-sport';
import { LeagueName } from './leagueName';
import { FootballCard, FootballGoal, FootballResult, FootballScore, FootballSheet } from './score';

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
            case FootballResult.Win:
                return 'gewonnen';
            case FootballResult.Draw:
                return 'gelijk';
            case FootballGoal.Normal:
                return 'goal';
            case FootballGoal.Assist:
                return 'assist';
            case FootballGoal.Penalty:
                return 'penalty';
            case FootballGoal.Own:
                return 'eigen goal';
            case FootballSheet.Clean:
                return 'geen tegengoals';
            case FootballSheet.Spotty:
                return 'te veel tegengoals';
            case FootballCard.Yellow:
                return 'gele kaart';
            case FootballCard.Red:
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
            case LeagueName.WorldCup:
                return 'wereld beker';
        }
        return '?';
    }

    convertToLeagueName(competition: Competition): LeagueName {
        switch (competition.getLeague().getName()) {
            case LeagueName.Competition:
                return LeagueName.Competition;
            case LeagueName.Cup:
                return LeagueName.Cup;
            case LeagueName.SuperCup:
                return LeagueName.SuperCup;
        }
        throw Error('unknown leagueName');
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
