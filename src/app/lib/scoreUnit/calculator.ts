import { Injectable } from '@angular/core';
import { map } from 'lodash';
import { Game } from 'ngx-sport';
import { CompetitionPerson } from '../competitionPerson';
import { GameRoundStats } from '../competitionPerson/gameRoundStats';
import { PersonStats } from '../competitionPerson/mapper';
import { PoolScoreUnit } from '../pool/scoreUnit';
import { ScoreUnit } from '../scoreUnit';

@Injectable()
export class ScoreUnitCalculator {
    protected calculatorMap: CalculatorMap = new CalculatorMap();
    constructor() {
        this.initCalculators();
    }

    getPoints(poolScoreUnits: PoolScoreUnit[], gameRoundStats: GameRoundStats[]): number {
        let points = 0;
        gameRoundStats.forEach(gameRoundStat => {
            poolScoreUnits.forEach((poolScoreUnit: PoolScoreUnit) => {
                const stats = gameRoundStat.getStats();
                if (this.lineIsCompatible(poolScoreUnit, stats))
                    points += this.getPointsHelper(poolScoreUnit, stats);
            });
        })
        return points;
    }

    protected lineIsCompatible(poolScoreUnit: PoolScoreUnit, stats: PersonStats): boolean {
        const stat = <number>stats.get(CompetitionPerson.Line);
        return stat ? (stat & poolScoreUnit.getBase().getLineDef()) > 0 : false;
    }

    protected getPointsHelper(poolScoreUnit: PoolScoreUnit, stats: PersonStats): number {
        let points = 0;
        const calculator = this.calculatorMap[poolScoreUnit.getNumber()];
        if (!calculator) {
            return points;
        }
        return calculator(poolScoreUnit, stats);
    }

    initCalculators() {

        this.calculatorMap[ScoreUnit.Points_Win] = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            return stats.get(CompetitionPerson.Result) === Game.Result_Win ? poolScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Points_Draw] = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            return stats.get(CompetitionPerson.Result) === Game.Result_Draw ? poolScoreUnit.getPoints() : 0;
        };
        const goalCalculator = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            const fieldGoalStat = stats.get(CompetitionPerson.Goals_Field);
            return fieldGoalStat ? +fieldGoalStat * poolScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Goal_Goalkeeper] = goalCalculator;
        this.calculatorMap[ScoreUnit.Goal_Defender] = goalCalculator;
        this.calculatorMap[ScoreUnit.Goal_Midfielder] = goalCalculator;
        this.calculatorMap[ScoreUnit.Goal_Forward] = goalCalculator;
        const assistCalculator = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            const assistStat = stats.get(CompetitionPerson.Assists);
            return assistStat ? +assistStat * poolScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Goal_Goalkeeper] = assistCalculator;
        this.calculatorMap[ScoreUnit.Goal_Defender] = assistCalculator;
        this.calculatorMap[ScoreUnit.Goal_Midfielder] = assistCalculator;
        this.calculatorMap[ScoreUnit.Goal_Forward] = assistCalculator;
        this.calculatorMap[ScoreUnit.Goal_Penalty] = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            const stat = stats.get(CompetitionPerson.Goals_Penalty);
            return stat ? +stat * poolScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Goal_Own] = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            const stat = stats.get(CompetitionPerson.Goals_Own);
            return stat ? +stat * poolScoreUnit.getPoints() : 0;
        };
        const cleanSheetCalculator = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            const stat = stats.get(CompetitionPerson.Sheet_Clean);
            return stat ? +stat * poolScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Sheet_Clean_Goalkeeper] = cleanSheetCalculator;
        this.calculatorMap[ScoreUnit.Sheet_Clean_Defender] = cleanSheetCalculator;
        const spottySheetCalculator = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            const stat = stats.get(CompetitionPerson.Sheet_Spotty);
            return stat ? +stat * poolScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Sheet_Spotty_Goalkeeper] = spottySheetCalculator;
        this.calculatorMap[ScoreUnit.Sheet_Spotty_Defender] = spottySheetCalculator;
        this.calculatorMap[ScoreUnit.Card_Yellow] = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            const stat = stats.get(CompetitionPerson.Cards_Yellow);
            return stat ? +stat * poolScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Card_Red] = (poolScoreUnit: PoolScoreUnit, stats: PersonStats): number => {
            const stat = stats.get(CompetitionPerson.Card_Red);
            return stat ? +stat * poolScoreUnit.getPoints() : 0;
        };
    }
}

class CalculatorMap extends Map {
    [key: number]: Function;
}