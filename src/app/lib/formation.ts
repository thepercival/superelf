
import { Identifiable, Person, Team } from 'ngx-sport';
import { S11FormationLine } from './formation/line';
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

    public getLine(lineNumber: number): S11FormationLine | undefined {
        const line = this.lines.find(line => line.getNumber() === lineNumber);
        if (line === undefined) {
            throw new Error('formationline not found');
        }
        return line;
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
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
        return this.getPlayers().find((player: S11Player) => {
            return player.getPerson().getPlayer(team, checkDate);
        });
    }

    public getPersons(): Person[] {
        return this.getPlayers().map((player: S11Player) => player.getPerson());
    }

    getName(): string {
        return this.getLines().map((line: S11FormationLine) => line.getPlaces().length - 1).join('-');
    }
}