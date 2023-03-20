import { FootballLine, Identifiable, Period, Person, Player, Team } from 'ngx-sport';
import { BadgeCategory } from './achievement/badge/category';
import { ViewPeriod } from './period/view';
import { LineScorePointsMap } from './score/points';
import { Totals } from './totals';

export class S11Player extends Identifiable {

    constructor(
        protected viewPeriod: ViewPeriod,
        protected person: Person,
        protected readonly players: Player[],
        protected totals: Totals) {
        super();
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }

    public getPerson(): Person {
        return this.person;
    }

    public getLine(): FootballLine {
        const player = this.getPlayers().shift();
        if (player === undefined) {
            throw new Error('s11player should always have a line');
        }
        return player.getLine();
    }

    public getTotals(): Totals {
        return this.totals;
    }

    public getPlayers(team?: Team, period?: Period, line?: number): Player[] {
        const filters: { (player: Player): boolean; }[] = [];
        if (team) {
            filters.push((player: Player) => player.getTeam() === team);
        }
        if (period) {
            filters.push((player: Player) => player.overlaps(period));
        }
        if (line) {
            filters.push((player: Player) => player.getLine() === line);
        }
        if (filters.length === 0) {
            return this.players.slice();
        }
        return this.players.filter((player: Player): boolean => {
            return filters.every(filter => filter(player));
        });
    }

    public getPlayersDescendingStart(team?: Team, period?: Period, line?: number): Player[] {
        return this.getPlayers(team, period, line).sort((plA: Player, plB: Player): number =>  {
            return plB.getStartDateTime().getTime() - plA.getStartDateTime().getTime();
        }).slice();
    }

    public getPlayer(team: Team, date?: Date): Player | undefined {
        const checkDate = date ? date : new Date();
        const filters: { (player: Player): boolean; }[] = [
            (player: Player) => player.getTeam() === team,
            (player: Player) => player.isIn(checkDate)
        ]
        return this.players.find((player: Player): boolean => {
            return filters.every(filter => filter(player));
        });
    }

    public getMostRecentPlayer(): Player|undefined {
        return this.getPlayersDescendingStart().shift();
    }

    hasAppeared(): boolean {
        return this.getTotals().getNrOfTimesStarted() > 0 || this.getTotals().getNrOfTimesSubstitute() > 0;
    }

    public getTotalPoints(lineScorePointsMap: LineScorePointsMap, badgeCategory: BadgeCategory|undefined): number {
        return this.totals.getPoints(this.getLine(), lineScorePointsMap, badgeCategory);
    }
}