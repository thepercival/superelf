import { Injectable } from '@angular/core';
import { AgainstResult, Game } from 'ngx-sport';
import { GameRoundScore } from '../gameRound/score';
import { SeasonScoreUnit } from '../ngx-sport/season/scoreUnit';
import { ViewPeriodPerson } from '../period/view/person';
import { ScoreUnit } from '../scoreUnit';

@Injectable()
export class ScoreUnitCalculator {
    protected calculatorMap: CalculatorMap = new CalculatorMap();
    constructor() {
        this.initCalculators();
    }

    getPoints(stats: Map<number, number | boolean>, seasonScoreUnits: SeasonScoreUnit[]): Map<number, number> {
        let points = new Map<number, number>();
        seasonScoreUnits.forEach((seasonScoreUnit: SeasonScoreUnit) => {
            points.set(seasonScoreUnit.getNumber(), this.calculatorMap.get(seasonScoreUnit.getNumber())(seasonScoreUnits, stats));
        });
        return points;
    }

    /* protected lineIsCompatible(seasonScoreUnit: SeasonScoreUnit, stats: PersonStats): boolean {
         const stat = <number>stats.get(CompetitionPerson.Line);
         return stat ? (stat & seasonScoreUnit.getBase().getLineDef()) > 0 : false;
     }
 
     protected getPointsHelper(seasonScoreUnit: SeasonScoreUnit, stats: PersonStats): number {
         let points = 0;
         const calculator = this.calculatorMap[seasonScoreUnit.getNumber()];
         if (!calculator) {
             return points;
         }
         return calculator(seasonScoreUnit, stats);
     }*/

    initCalculators() {

        this.calculatorMap[ScoreUnit.Points_Win] = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            return stats.get(ViewPeriodPerson.Result) === AgainstResult.Win ? seasonScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Points_Draw] = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            return stats.get(ViewPeriodPerson.Result) === AgainstResult.Draw ? seasonScoreUnit.getPoints() : 0;
        };
        const goalCalculator = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            const fieldGoalStat = stats.get(ViewPeriodPerson.Goals_Field);
            return fieldGoalStat ? +fieldGoalStat * seasonScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Goal_Goalkeeper] = goalCalculator;
        this.calculatorMap[ScoreUnit.Goal_Defender] = goalCalculator;
        this.calculatorMap[ScoreUnit.Goal_Midfielder] = goalCalculator;
        this.calculatorMap[ScoreUnit.Goal_Forward] = goalCalculator;
        const assistCalculator = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            const assistStat = stats.get(ViewPeriodPerson.Assists);
            return assistStat ? +assistStat * seasonScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Goal_Goalkeeper] = assistCalculator;
        this.calculatorMap[ScoreUnit.Goal_Defender] = assistCalculator;
        this.calculatorMap[ScoreUnit.Goal_Midfielder] = assistCalculator;
        this.calculatorMap[ScoreUnit.Goal_Forward] = assistCalculator;
        this.calculatorMap[ScoreUnit.Goal_Penalty] = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            const stat = stats.get(ViewPeriodPerson.Goals_Penalty);
            return stat ? +stat * seasonScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Goal_Own] = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            const stat = stats.get(ViewPeriodPerson.Goals_Own);
            return stat ? +stat * seasonScoreUnit.getPoints() : 0;
        };
        const cleanSheetCalculator = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            const stat = stats.get(ViewPeriodPerson.Sheet_Clean);
            return stat ? +stat * seasonScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Sheet_Clean_Goalkeeper] = cleanSheetCalculator;
        this.calculatorMap[ScoreUnit.Sheet_Clean_Defender] = cleanSheetCalculator;
        const spottySheetCalculator = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            const stat = stats.get(ViewPeriodPerson.Sheet_Spotty);
            return stat ? +stat * seasonScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Sheet_Spotty_Goalkeeper] = spottySheetCalculator;
        this.calculatorMap[ScoreUnit.Sheet_Spotty_Defender] = spottySheetCalculator;
        this.calculatorMap[ScoreUnit.Card_Yellow] = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            const stat = stats.get(ViewPeriodPerson.Cards_Yellow);
            return stat ? +stat * seasonScoreUnit.getPoints() : 0;
        };
        this.calculatorMap[ScoreUnit.Card_Red] = (seasonScoreUnit: SeasonScoreUnit, stats: Map<number, number | boolean>): number => {
            const stat = stats.get(ViewPeriodPerson.Card_Red);
            return stat ? +stat * seasonScoreUnit.getPoints() : 0;
        };
    }
    /*
        public function getPoints(array $stats, array $seasonScoreUnits): array {
            $points = [];
            foreach($seasonScoreUnits as $seasonScoreUnit) {
                $points[$seasonScoreUnit -> getNumber()] = $this -> calculators[$seasonScoreUnit -> getNumber()]($seasonScoreUnit, $stats);
            }
            return $points;
        }*/

}

class CalculatorMap extends Map {
    [key: number]: Function;
}