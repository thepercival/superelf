export interface JsonGameRoundScore {
    gameRoundNumber: number;
    points: Map<number, number>;
    total: number;
}

export class GameRoundScoreMap extends Map {
    [key: number]: number;
}
