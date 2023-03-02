import { FootballLine, Identifiable, Team } from 'ngx-sport';
import { GameRound } from '../gameRound';
import { OneTeamSimultaneous } from '../oneTeamSimultaneousService';
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

    public getTeam(dateTime: Date): Team|undefined
    {
        const s11Player = this.getPlayer();
        if( s11Player === undefined ) {
            return undefined;
        }
        const player = (new OneTeamSimultaneous()).getPlayer(s11Player, dateTime );
        return player?.getTeam();
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
}

