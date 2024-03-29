import { AgainstGame, Period } from 'ngx-sport';
import { ViewPeriod } from './period/view';

export class GameRound {
    protected againstGames: AgainstGame[] | undefined;
    protected period: Period|undefined;

    constructor(protected viewPeriod: ViewPeriod, protected number: number) {
        viewPeriod.getGameRounds().push(this);
    }

    public getNumber(): number {
        return this.number;
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }

    public hasAgainstGames(): boolean {
        return this.againstGames !== undefined && this.againstGames.length > 0;
    }

    public getAgainstGames(): AgainstGame[] {
        if (this.againstGames === undefined) {
            throw new Error('gameround has uninitialized againstgames');
        }
        return this.againstGames;
    }

    public setAgainstGames(againstGames: AgainstGame[]): void {
        this.againstGames = againstGames;
        const dates = this.againstGames.map((againstGame: AgainstGame): number => againstGame.getStartDateTime().getTime() );
        this.period = new Period(new Date(Math.min(...dates)), new Date(Math.max(...dates)));
    }

    public getPeriod(): Period|undefined {
        return this.period;
    }
}