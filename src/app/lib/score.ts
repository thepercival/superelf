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

export type FootballScore = FootballResult | FootballGoal | FootballSheet | FootballCard;

export interface FootballLineScore {
    line: FootballLine;
    score: FootballScore;
}

export type FootballEvent = FootballGoal | FootballCard;

export enum BadgeEnum {
    Result = 0,
    Goal,
    Assist,
    Sheet,
    Card,
}