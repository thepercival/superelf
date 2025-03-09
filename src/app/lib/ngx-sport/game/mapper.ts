import { Injectable } from '@angular/core';
import { Association, Competition, JsonPerson, Person, PersonMapper, Player, PlayerMapper } from 'ngx-sport';
import { ViewPeriod } from '../../periods/viewPeriod';
import { JsonS11Player } from '../../player/json';
import { AgainstGameCardEvent, AgainstGameEvent, AgainstGameGoalEvent, AgainstGameLineupItem, AgainstGameSubstitute, JsonAgainstGameCardEvent, JsonAgainstGameEvent, JsonAgainstGameGoalEvent, JsonAgainstGameLineupItem, JsonAgainstGameSubstitute } from './football';

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
            return this.toLineupItem(jsonLineupItem, competition);
        });
    }

    toLineupItem(jsonLineupItem: JsonAgainstGameLineupItem, competition: Competition): AgainstGameLineupItem {
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

     instanceOfGoalEvent(event: any): event is JsonAgainstGameGoalEvent {
        return 'score' in event;
    }

    instanceOfCardEvent(event: any): event is JsonAgainstGameCardEvent {
        return 'color' in event;
    }

    toEvents(json: (JsonAgainstGameGoalEvent | JsonAgainstGameCardEvent)[], competition: Competition): (AgainstGameGoalEvent | AgainstGameCardEvent)[] {

        // const association = competition.getLeague().getAssociation();
        // const person = this.personMapper.toObject(json.person, association, undefined);
        return json.map((jsonEvent: JsonAgainstGameGoalEvent | JsonAgainstGameCardEvent): AgainstGameGoalEvent | AgainstGameCardEvent => {
            if( this.instanceOfGoalEvent(jsonEvent) ) {
                return this.toGoalEvent(jsonEvent, competition);
            }
            // if( this.instanceOfGoalEvent(jsonEvent) ) {
                return this.toCardEvent(jsonEvent, competition);
            // }
        });
    }

    toGoalEvent(json: JsonAgainstGameGoalEvent, competition: Competition): AgainstGameGoalEvent {

        const person = this.toPerson(json.player.person, competition.getAssociation());
        
        const goalEvent: AgainstGameGoalEvent = {
            minute: json.minute,
            player: this.playerMapper.toObject(json.player, competition.getAssociation(), person),
            score: json.score,
            assistPlayer: undefined
        };
        if( json.assistPlayer) {
            const subPerson = this.toPerson(json.assistPlayer.person, competition.getAssociation());
            goalEvent.assistPlayer = this.playerMapper.toObject(json.assistPlayer, competition.getAssociation(), subPerson);
        }
        return goalEvent;

    }

    toCardEvent(json: JsonAgainstGameCardEvent, competition: Competition): AgainstGameCardEvent {

        const person = this.toPerson(json.player.person, competition.getAssociation());
        return {
            minute: json.minute,
            player: this.playerMapper.toObject(json.player, competition.getAssociation(), person),
            color: json.color
        };
    }

    toPerson(jsonPerson: JsonPerson | undefined, association: Association): Person {
        if (jsonPerson === undefined) {
            throw new Error('person should be set');
        }
        return this.personMapper.toObject(jsonPerson, association);
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

