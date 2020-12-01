import { Injectable } from '@angular/core';
import { Competition, PersonMapper } from 'ngx-sport';
import { ScoreUnit } from '../scoreUnit';
import { CompetitionPerson } from '../competitionPerson';
import { JsonCompetitionPerson } from './json';
import { GameRoundStats } from './gameRoundStats';

@Injectable()
export class CompetitionPersonMapper {
    constructor(protected personMapper: PersonMapper) { }

    toObject(json: JsonCompetitionPerson, competition: Competition): CompetitionPerson {
        const association = competition.getLeague().getAssociation();
        const competitionPerson = new CompetitionPerson(
            competition,
            this.personMapper.toObject(json.person, association, undefined));
        competitionPerson.setId(json.id);

        console.log(json.gameRoundScores)

        json.gameRoundScores.forEach(jsongameRoundStat => {
            const personStats = new PersonStats();
            for (let stat in jsongameRoundStat.detailedPoints) {
                personStats.set(+stat, jsongameRoundStat.detailedPoints[stat]);
            }
            new GameRoundStats(competitionPerson, jsongameRoundStat.gameRoundNumber, personStats);
        });
        return competitionPerson;
    }

    toJson(scoreUnit: ScoreUnit): number {
        return scoreUnit.getNumber();
    }
}

export class PersonStats extends Map {
    [key: number]: boolean | number;
}

// export class PersonStats extends Map<number, boolean | number> {

// }

