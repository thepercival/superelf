import { FootballLine } from "ngx-sport";

export enum FootballScore {
    WinResult = 'winresult',
    DrawResult = 'drawresult',
    Goal = 'goal',
    Assist = 'assist',
    PenaltyGoal = 'penaltygoal',
    OwnGoal = 'owngoal',
    CleanSheet = 'cleansheet',
    SpottySheet = 'spottysheet',
    YellowCard = 'yellowcard',
    RedCard = 'redcard'
}

export interface FootballLineScore {
    line: FootballLine;
    score: FootballScore;
}
