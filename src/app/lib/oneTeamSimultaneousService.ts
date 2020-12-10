import { Person, Player } from 'ngx-sport';

export class OneTeamSimultaneous {
    public getPlayer(person: Person, date?: Date): Player | undefined {
        const checkDate = date ? date : new Date();
        return person.getPlayers().find((player: Player): boolean => player.getPeriod().isIn(checkDate));
    }
}