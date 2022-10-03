import { JsonPlayer, Player } from "ngx-sport";
import { S11Player } from "../../player";
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

export interface AgainstGameEvent {
    minute: number;
    player: JsonPlayer;
}

export interface AgainstGameGoalEvent extends AgainstGameEvent {
    score: FootballGoal;
    assistS11Player: S11Player | undefined;
}

export interface AgainstGameCardEvent extends AgainstGameEvent {
    color: FootballCard;
}
