import { CustomSport, FootballLine } from 'ngx-sport';

export class ScoreUnit {

    static readonly Points_Win = 1;
    static readonly Points_Draw = 2;
    static readonly Goal_Goalkeeper = 4;
    static readonly Goal_Defender = 8;
    static readonly Goal_Midfielder = 16;
    static readonly Goal_Forward = 32;
    static readonly Assist_Goalkeeper = 64;
    static readonly Assist_Defender = 128;
    static readonly Assist_Midfielder = 256;
    static readonly Assist_Forward = 512;
    static readonly Goal_Penalty = 1024;
    static readonly Goal_Own = 2048;
    static readonly Sheet_Clean_Goalkeeper = 4096;
    static readonly Sheet_Clean_Defender = 8192;
    static readonly Sheet_Spotty_Goalkeeper = 16384;
    static readonly Sheet_Spotty_Defender = 32768;
    static readonly Card_Yellow = 65536;
    static readonly Card_Red = 131072;

    constructor(protected nr: number) {
    }

    public getNumber(): number {
        return this.nr;
    }

    public getLineDef(): number {
        switch (this.nr) {
            case ScoreUnit.Goal_Goalkeeper:
            case ScoreUnit.Assist_Goalkeeper:
            case ScoreUnit.Sheet_Clean_Goalkeeper:
            case ScoreUnit.Sheet_Spotty_Goalkeeper:
                return FootballLine.GoalKepeer;
            case ScoreUnit.Goal_Defender:
            case ScoreUnit.Assist_Defender:
            case ScoreUnit.Sheet_Clean_Defender:
            case ScoreUnit.Sheet_Spotty_Defender:
                return FootballLine.Defense;
            case ScoreUnit.Goal_Midfielder:
            case ScoreUnit.Assist_Midfielder:
                return FootballLine.Midfield;
            case ScoreUnit.Goal_Forward:
            case ScoreUnit.Assist_Forward:
                return FootballLine.Forward;
        }
        return FootballLine.All;
    }
}