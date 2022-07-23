// import { FootballLine, Identifiable } from "ngx-sport";
// import { Score } from "./score";

import { FootballLine } from "ngx-sport";
import { FootballLineScore, FootballScore } from "../score";


export interface ScorePoints {
    score: FootballScore; /* | OtherSportScore */
    points: number;
}

export interface LineScorePoints extends ScorePoints {
    line: FootballLine
}

export class LineScorePointsMap {
    private map: Map<string, number>;

    constructor(points: LineScorePoints[]) {
        this.map = new Map(
            points.map((points: LineScorePoints) => {
                return [this.getUniqueIndex(points), points.points];
            }),
        );
    }

    getUniqueIndex(points: FootballLineScore): string {
        return points.line + '-' + points.score;
    }

    public get(lineScore: FootballLineScore): number {
        const retVal = this.map.get(this.getUniqueIndex(lineScore));
        if (retVal === undefined) {
            throw new Error('lineScoreNotFound');
        }
        return retVal;
    }
}





// export class ScorePoints {
//     constructor(protected score: Score, protected points: number) {

//     }

//     getScore(): Score {
//         return this.score;
//     }

//     getPoints(): number {
//         return this.points;
//     }
// }

// export class LineScorePoints extends ScorePoints {
//     constructor(protected line: FootballLine, score: Score, points: number) {
//         super(score, points);
//     }

//     getLine(): FootballLine {
//         return this.line;
//     }
// }


// export class Points extends Identifiable {

//     map<string, ScorePoints>
//     map<string, LineScorePoints(ScorePoints, FootballLine)

//     map<string, Score>
//     map<string, LineScore(Score, FootballLine)
    
//     ScorePoints{
//         Score: Score;
//         points: number;
//     }

//     LineScorePoints{
//         Score: Score;
//         points: number;
//     }


//     constructorPointsPointsPoints(


//     constructor(

//     FootballLine
    
//     constructor: constructor;
//     ScorePoints{
 
 
//  Line    
//     constructor: constructor;
//     ScorePoints{
 
//         points: number;
//     }
//         protected resultWin: number,
//         protected resultDraw: number,
//         protected fieldGoalGoalkeeper: number,
//         protected fieldGoalDefender: number,
//         protected fieldGoalMidfielder: number,
//         protected fieldGoalForward: number,
//         protected assistGoalkeeper: number,
//         protected assistDefender: number,
//         protected assistMidfielder: number,
//         protected assistForward: number,
//         protected penalty: number,
//         protected ownGoal: number,
//         protected cleanSheetGoalkeeper: number,
//         protected cleanSheetDefender: number,
//         protected spottySheetGoalkeeper: number,
//         protected spottySheetDefender: number,
//         protected cardYellow: number,
//         protected cardRed: number
//     ) {
//         super();
//     }

//     getId(): string {

//     }

//     public getResultWin(): number {
//         return this.resultWin;
//     }

//     public getResultDraw(): number {
//         return this.resultDraw;
//     }

//     public getFieldGoalGoalkeeper(): number {
//         return this.fieldGoalGoalkeeper;
//     }

//     public getFieldGoalDefender(): number {
//         return this.fieldGoalDefender;
//     }

//     public getFieldGoalMidfielder(): number {
//         return this.fieldGoalMidfielder;
//     }

//     public getFieldGoalForward(): number {
//         return this.fieldGoalForward;
//     }

//     public getFieldGoal(line: FootballLine): number {
//         switch (line) {
//             case FootballLine.GoalKeeper:
//                 return this.getFieldGoalGoalkeeper();
//             case FootballLine.Defense:
//                 return this.getFieldGoalDefender();
//             case FootballLine.Midfield:
//                 return this.getFieldGoalMidfielder();
//             case FootballLine.Forward:
//                 return this.getFieldGoalForward();
//         }
//         throw new Error('line is incorrect ');
//     }

//     public getAssistGoalkeeper(): number {
//         return this.assistGoalkeeper;
//     }

//     public getAssistDefender(): number {
//         return this.assistDefender;
//     }

//     public getAssistMidfielder(): number {
//         return this.assistMidfielder;
//     }

//     public getAssistForward(): number {
//         return this.assistForward;
//     }

//     public getAssist(line: FootballLine): number {
//         switch (line) {
//             case FootballLine.GoalKeeper:
//                 return this.getAssistGoalkeeper();
//             case FootballLine.Defense:
//                 return this.getAssistDefender();
//             case FootballLine.Midfield:
//                 return this.getAssistMidfielder();
//             case FootballLine.Forward:
//                 return this.getAssistForward();
//         }
//         throw new Error('line is incorrect ');
//     }

//     public getPenalty(): number {
//         return this.penalty;
//     }

//     public getOwnGoal(): number {
//         return this.ownGoal;
//     }

//     public getCleanSheetGoalkeeper(): number {
//         return this.cleanSheetGoalkeeper;
//     }

//     public getCleanSheetDefender(): number {
//         return this.cleanSheetDefender;
//     }

//     public getCleanSheet(line: FootballLine): number {
//         if (line === FootballLine.GoalKeeper) {
//             return this.getCleanSheetGoalkeeper();
//         } else if (line === FootballLine.Defense) {
//             return this.getCleanSheetDefender();
//         }
//         throw new Error('line is incorrect ');
//     }

//     public getSpottySheetGoalkeeper(): number {
//         return this.spottySheetGoalkeeper;
//     }

//     public getSpottySheetDefender(): number {
//         return this.spottySheetDefender;
//     }

//     public getSpottySheet(line: FootballLine): number {
//         if (line === FootballLine.GoalKeeper) {
//             return this.getSpottySheetGoalkeeper();
//         } else if (line === FootballLine.Defense) {
//             return this.getSpottySheetDefender();
//         }
//         throw new Error('line is incorrect ');
//     }

//     public getCardYellow(): number {
//         return this.cardYellow;
//     }

//     public getCardRed(): number {
//         return this.cardRed;
//     }

//     // getScores(formationLine: FootballLine | undefined): Score[] {
//     //     if (formationLine === undefined) {
//     //         return this.scores;
//     //     }
//     //     return this.scores.filter(score => score.getBase().getLineDef() === formationLineDef);
//     // }
// }