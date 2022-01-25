
import { Formation, FormationLine, Identifiable, Person, Team } from 'ngx-sport';
import { S11FormationLine } from './formation/line';
import { S11FormationPlace } from './formation/place';
import { ViewPeriod } from './period/view';
import { S11Player } from './player';
import { PoolUser } from './pool/user';

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
        return formations.find((formation: Formation): boolean => {
            return formation.getLines().every((formationLine: FormationLine): boolean => {
                const s11Line = this.getLine(formationLine.getNumber())
                return formationLine.getNumber() === s11Line.getNumber()
                    && formationLine.getNrOfPersons() === s11Line.getStartingPlaces().length;
            });
        });
    }
}