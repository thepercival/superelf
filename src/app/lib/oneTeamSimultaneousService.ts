import { Player } from 'ngx-sport';
import { S11Player } from './player';

export class OneTeamSimultaneous {
    public getCurrentPlayer(s11Player: S11Player,): Player | undefined {
        return this.getPlayer(s11Player, new Date());
    }

    public getPlayer(s11Player: S11Player, date: Date): Player | undefined {
        const checkDate = date ? date : new Date();
        return s11Player.getPlayers().find((player: Player): boolean => {
            return player.isIn(checkDate);
        });
    }
}