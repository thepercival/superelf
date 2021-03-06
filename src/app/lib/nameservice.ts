import { SportCustom } from 'ngx-sport';
import { ScoreUnit } from './scoreUnit';


export class SuperElfNameService {
    constructor() {
    }

    getLineName(lineDef: number): string {
        if (lineDef === SportCustom.Football_Line_GoalKepeer) {
            return 'keeper';
        } else if (lineDef === SportCustom.Football_Line_Defense) {
            return 'verdediging';
        } else if (lineDef === SportCustom.Football_Line_Midfield) {
            return 'middenveld';
        } else if (lineDef === SportCustom.Football_Line_Forward) {
            return 'aanval';
        }
        return 'alle linies';
    }

    getScoreUnitName(scoreUnit: ScoreUnit): string {
        switch (scoreUnit.getNumber()) {
            case ScoreUnit.Points_Win:
                return 'gewonnen';
            case ScoreUnit.Points_Draw:
                return 'gelijk';
            case ScoreUnit.Goal_Goalkeeper:
            case ScoreUnit.Goal_Defender:
            case ScoreUnit.Goal_Midfielder:
            case ScoreUnit.Goal_Forward:
                return 'goal';
            case ScoreUnit.Assist_Goalkeeper:
            case ScoreUnit.Assist_Defender:
            case ScoreUnit.Assist_Midfielder:
            case ScoreUnit.Assist_Forward:
                return 'assist';
            case ScoreUnit.Goal_Penalty:
                return 'penalty';
            case ScoreUnit.Goal_Own:
                return 'eigen goal';
            case ScoreUnit.Sheet_Clean_Goalkeeper:
            case ScoreUnit.Sheet_Clean_Defender:
                return 'geen tegengoals';
            case ScoreUnit.Sheet_Spotty_Goalkeeper:
            case ScoreUnit.Sheet_Spotty_Defender:
                return 'te veel tegengoals';
            case ScoreUnit.Card_Yellow:
                return 'gele kaart';
            case ScoreUnit.Card_Red:
                return 'rode kaart';
        }
        return '?';
    }
}
