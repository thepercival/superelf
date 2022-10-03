import { JsonPlayer, Player } from "ngx-sport";
import { FootballCard, FootballGoal } from "../../score";

export interface JsonAgainstGameLineupItem {
    player: JsonPlayer;
    substitute: JsonAgainstGameSubstitute | undefined;
}

export interface JsonAgainstGameSubstitute extends JsonAgainstGameLineupItem {
    minute: number;
}

export interface AgainstGameLineupItem {
    player: Player;
    substitute: AgainstGameSubstitute | undefined;
}

export interface AgainstGameSubstitute extends AgainstGameLineupItem {
    minute: number;
}

export interface JsonAgainstGameEvent {
    minute: number;
    player: JsonPlayer;
}

export interface JsonAgainstGameGoalEvent extends JsonAgainstGameEvent {
    score: FootballGoal;
    assistPlayer: JsonPlayer | undefined;
}

export interface JsonAgainstGameCardEvent extends JsonAgainstGameEvent {
    color: FootballCard;
}

export interface AgainstGameEvent {
    minute: number;
    player: Player;
}

export interface AgainstGameGoalEvent extends AgainstGameEvent {
    score: FootballGoal;
    assistPlayer: Player | undefined;
}

export interface AgainstGameCardEvent extends AgainstGameEvent {
    color: FootballCard;
}
