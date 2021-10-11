
import { Team } from 'ngx-sport';
import { FormationLine } from './formation/line';
import { ViewPeriod } from './period/view';
import { S11Player } from './player';
import { PoolUser } from './pool/user';

export class Formation {
    static readonly TotalNrOfPersons: number = 15;
    protected lines: FormationLine[] = [];
    protected id: number = 0;

    constructor(protected poolUser: PoolUser, protected viewPeriod: ViewPeriod, protected name: string) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    public getPoolUser(): PoolUser {
        return this.poolUser;
    }

    public getName(): string {
        return this.name;
    }

    public getLines(): FormationLine[] {
        return this.lines;
    }

    public getLine(lineNumber: number): FormationLine | undefined {
        return this.lines.find(line => line.getNumber() === lineNumber);
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }

    public getPlayers(): S11Player[] {
        let players: S11Player[] = [];
        this.lines.forEach(line => {
            players = players.concat(line.getPlayers());
        });
        return players;
    }

    public getPlayer(team: Team, date?: Date): S11Player | undefined {
        const checkDate = date ? date : new Date();
        return this.getPlayers().find((player: S11Player) => {
            return player.getPerson().getPlayer(team, checkDate);
        });
    }
}