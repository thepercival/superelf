import { Competition, Person } from 'ngx-sport';
import { GameRoundStats } from './competitionPerson/gameRoundStats';

export class CompetitionPerson {
    static readonly Sheet_Spotty_Threshold = 4;

    static readonly Result = 1;
    static readonly Goals_Field = 2;
    static readonly Goals_Penalty = 4;
    static readonly Goals_Own = 8;
    static readonly Assists = 16;
    static readonly Sheet_Clean = 32;
    static readonly Sheet_Spotty = 64;
    static readonly Cards_Yellow = 128;
    static readonly Card_Red = 256;
    static readonly Lineup = 512;
    static readonly Substituted = 1024;
    static readonly Substitute = 2048;
    static readonly Line = 4096;

    protected id: number = 0;
    protected gameRoundStats: GameRoundStats[] = [];

    constructor(protected competition: Competition, protected person: Person) {

    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    public getCompetition(): Competition {
        return this.competition;
    }

    public getPerson(): Person {
        return this.person;
    }

    public getGameRoundStats(): GameRoundStats[] {
        return this.gameRoundStats;
    }
}