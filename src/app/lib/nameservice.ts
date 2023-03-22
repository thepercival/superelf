import { Injectable } from '@angular/core';
import { AgainstGame, AgainstSide, Competition, FootballLine, GameState, ScoreConfigService } from 'ngx-sport';
import { BadgeCategory } from './achievement/badge/category';
import { LeagueName } from './leagueName';
import { FootballCard, FootballGoal, FootballLineScore, FootballResult, FootballScore, FootballScoreLine, FootballSheet } from './score';

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

    getScoreName(score: FootballScore|FootballScoreLine): string {
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

    getAgainstScore(againstGame: AgainstGame, side?: AgainstSide): string {
        if (againstGame.getState() !== GameState.Finished) {
            return side === undefined ? ' vs ' : '';
        }
        const score = ' - ';
        const finalScore = this.scoreConfigService.getFinalAgainstScore(againstGame);
        if (finalScore === undefined) {
            return score;
        }
        if( side === undefined ) {
            return finalScore.getHome() + score + finalScore.getAway();
        }
        return '' + finalScore.get(side);
    }

    getBadgeCategoryName(badgeCategory: BadgeCategory): string {
        switch (badgeCategory) {
            case BadgeCategory.Result:
              return 'resultaten';
            case BadgeCategory.Goal:
                return 'goals';
            case BadgeCategory.Assist:
                return 'assists';
            case BadgeCategory.Sheet:
                return 'de-nul houden';
            case BadgeCategory.Card:
                return 'sportiviteit';
        }
        throw Error('unknown badgeCategory');
    }
}
