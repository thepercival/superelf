import { FootballLine, Identifiable } from 'ngx-sport';
import { S11Formation } from '../formation';
import { GameRound } from '../gameRound';
import { S11Player } from '../player';
import { PointsCalculator } from '../points/calculator';
import { JsonTotals } from '../totals/json';
import { S11FormationLine } from './line';

export class S11FormationPlace extends Identifiable {
    protected number: number;
    protected penaltyPoints: number = 0;

    constructor(
        protected formationLine: S11FormationLine,
        protected player: S11Player | undefined,
        number: number | undefined,
        protected totals: JsonTotals,
        protected totalPoints: number) {
        super();
        this.formationLine.getPlaces().push(this);
        if (number === undefined) {
            number = this.formationLine.getPlaces().length;
        }
        this.number = number;
    }

    public getFormationLine(): S11FormationLine {
        return this.formationLine;
    }

    public getLine(): FootballLine {
        return this.formationLine.getNumber();
    }

    public getNumber(): number {
        return this.number;
    }

    public getPenaltyPoints(): number {
        return this.penaltyPoints;
    }

    public setPenaltyPoints(penaltyPoints: number): void {
        this.penaltyPoints = penaltyPoints;
    }

    public getPlayer(): S11Player | undefined {
        return this.player;
    }

    public setPlayer(player: S11Player | undefined): void {
        this.player = player;
    }

    public isSubstitute(): boolean {
        return this.number === 0;
    }


    public getTotals(): JsonTotals {
        return this.totals;
    }

    public getTotalPoints(): number {
        return this.totalPoints;
    }

    getPoints(gameRound: GameRound | undefined): number {
        const player = this.getPlayer();
        if (player === undefined) {
            return 0;
        }
        if (gameRound === undefined) {
            return this.totalPoints;
        }
        const statistics = player.getGameStatistics(gameRound.getNumber());
        if (statistics === undefined) {
            return 0;
        }
        if (this.isSubstitute() && !this.getFormationLine().hasSubstituteAppareance(gameRound)) {
            return 0;
        }
        const competitionConfig = this.getFormationLine().getFormation().getPoolUser().getPool().getCompetitionConfig();
        return (new PointsCalculator(competitionConfig)).getPoints(this.getLine(), statistics);
    }

    hasStatistics(gameRound: GameRound | undefined): boolean {
        const player = this.getPlayer();
        if (player === undefined) {
            return false;
        }
        if (gameRound === undefined) {
            return player.hasSomeStatistics();
        }
        const statistics = player.getGameStatistics(gameRound.getNumber());
        if (statistics === undefined) {
            return false;
        }
        return !this.isSubstitute() || this.getFormationLine().hasSubstituteAppareance(gameRound);
    }

    hasAppeared(gameRound?: GameRound | undefined): boolean {
        if (this.isSubstitute() && !this.getFormationLine().hasSubstituteAppareance(gameRound)) {
            return false;
        }
        const s11Player = this.getPlayer();
        if (s11Player === undefined) {
            return false;
        }
        if (gameRound === undefined) {
            return s11Player.hasAppeared();
        }
        return s11Player.getGameStatistics(gameRound.getNumber())?.hasAppeared() === true;
    }

}

