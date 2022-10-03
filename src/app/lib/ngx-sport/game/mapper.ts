import { Injectable } from '@angular/core';
import { Association, Competition, JsonPerson, Person, PersonMapper, PlayerMapper } from 'ngx-sport';
import { ViewPeriod } from '../../period/view';
import { JsonS11Player } from '../../player/json';
import { AgainstGameLineupItem, AgainstGameSubstitute, JsonAgainstGameLineupItem, JsonAgainstGameSubstitute } from './football';

@Injectable({
    providedIn: 'root'
})
export class AgainstGameMapper {
    constructor(
        protected personMapper: PersonMapper,
        protected playerMapper: PlayerMapper) { }

    toLineup(json: JsonAgainstGameLineupItem[], competition: Competition): AgainstGameLineupItem[] {

        // const association = competition.getLeague().getAssociation();
        // const person = this.personMapper.toObject(json.person, association, undefined);
        return json.map((jsonLineupItem: JsonAgainstGameLineupItem): AgainstGameLineupItem => {
            return this.toObject(jsonLineupItem, competition);
        });
    }

    toObject(jsonLineupItem: JsonAgainstGameLineupItem, competition: Competition): AgainstGameLineupItem {
        const person = this.toPerson(jsonLineupItem.player.person, competition.getAssociation());
        const lineupItem: AgainstGameLineupItem = {
            player: this.playerMapper.toObject(jsonLineupItem.player, competition.getAssociation(), person),
            substitute: undefined
        };
        if (jsonLineupItem.substitute !== undefined) {
            lineupItem.substitute = this.toSubstitute(jsonLineupItem.substitute, competition);
        }
        return lineupItem;
    }

    toPerson(jsonPerson: JsonPerson | undefined, association: Association): Person {
        if (jsonPerson === undefined) {
            throw new Error('person should be set');
        }
        return this.personMapper.toObject(jsonPerson, association);
    }

    toSubstitute(jsonSubstitute: JsonAgainstGameSubstitute, competition: Competition): AgainstGameSubstitute {
        const person = this.toPerson(jsonSubstitute.player.person, competition.getAssociation());
        const substitute: AgainstGameSubstitute = {
            minute: jsonSubstitute.minute,
            player: this.playerMapper.toObject(jsonSubstitute.player, competition.getAssociation(), person),
            substitute: undefined
        };
        if (jsonSubstitute.substitute !== undefined) {
            substitute.substitute = this.toSubstitute(jsonSubstitute.substitute, competition);
        }
        return substitute;
    }


    // toJson(player: S11Player): JsonS11Player {
    //     return {
    //         id: player.getId(),
    //         person: this.personMapper.toJson(player.getPerson()),
    //         players: [],
    //         statistics: undefined,
    //         totals: player.getTotals(),
    //         totalPoints: player.getTotalPoints()
    //         // gameRoundScores: []
    //     };
    // }
}

//export class S11PlayerMap extends Map<number, S11Player> {

//}

