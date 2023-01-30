
import { Formation, FormationLine, Identifiable, Person, Team } from 'ngx-sport';
import { S11FormationLine } from './formation/line';
import { S11FormationPlace } from './formation/place';
import { GameRound } from './gameRound';
import { ViewPeriod } from './period/view';
import { S11Player } from './player';
import { PoolUser } from './pool/user';
import { ScorePoints } from './score/points';

export class S11Formation extends Identifiable {
    static readonly FootbalNrOfPersons: number = 11;
    private lines: S11FormationLine[] = [];

    constructor(protected poolUser: PoolUser, protected viewPeriod: ViewPeriod) {
        super();
    }

    public getPoolUser(): PoolUser {
        return this.poolUser;
    }

    public getLines(): S11FormationLine[] {
        return this.lines;
    }

    public getLine(lineNumber: number): S11FormationLine {
        const line = this.lines.find(line => line.getNumber() === lineNumber);
        if (line === undefined) {
            throw new Error('formationline not found');
        }
        return line;
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }

    public getPlaces(): S11FormationPlace[] {
        let places: S11FormationPlace[] = [];
        this.lines.forEach(line => {
            places = places.concat(line.getPlaces());
        });
        return places;
    }

    public getPlayers(): S11Player[] {
        let players: S11Player[] = [];
        this.lines.forEach(line => {
            players = players.concat(line.getPlayers(true));
        });
        return players;
    }

    public getPlayer(team: Team, date?: Date): S11Player | undefined {
        const checkDate = date ? date : new Date();
        return this.getPlayers().find((s11Player: S11Player) => {
            return s11Player.getPlayer(team, checkDate);
        });
    }

    public getPersons(): Person[] {
        return this.getPlayers().map((player: S11Player) => player.getPerson());
    }

    public getName(): string {
        return this.getLines().map((line: S11FormationLine) => line.getPlaces().length - 1).join('-');
    }

    public getEqualFormation(formations: Formation[]): Formation | undefined {
        const formationBase = this.convertToBase();
        return formations.find((formation: Formation): boolean => {
            return formationBase.equals(formation);
        });
    }

    public convertToBase(): Formation {
        return new Formation( this.getLines().map((s11Line: S11FormationLine): FormationLine => {
            return new FormationLine(s11Line.getNumber(), s11Line.getStartingPlaces().length );
        } ) );
    }

    getPoints(gameRound: GameRound | undefined): number {
        let points = 0;
        for (let line of this.getLines()) {
            points += line.getPoints(gameRound);
        }
        return points;
    }
}