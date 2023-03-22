import { FootballLine } from "ngx-sport";

export enum FootballResult {
    Win = 'winresult',
    Draw = 'drawresult'
}

export enum FootballGoal {
    Normal = 'goal',
    Assist = 'assist',
    Penalty = 'penaltygoal',
    Own = 'owngoal'
}

export enum FootballSheet {
    Clean = 'cleansheet',
    Spotty = 'spottysheet'
}

export enum FootballCard {
    Yellow = 'yellowcard',
    Red = 'redcard'
}

export type FootballScore = FootballResult | FootballCard | FootballGoal.Penalty | FootballGoal.Own;

export type FootballScoreLine = FootballSheet | FootballGoal.Normal | FootballGoal.Assist;

export interface FootballLineScore {
    line: FootballLine;
    score: FootballScoreLine;
}

export type FootballEvent = FootballGoal | FootballCard;