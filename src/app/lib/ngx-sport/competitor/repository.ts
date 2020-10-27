import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Competitor, JsonCompetitor, Competition } from 'ngx-sport';
import { Tournament } from '../../pool';
import { CompetitorMapper } from '../../competitor/mapper';
import { TournamentCompetitor } from '../../competitor';


@Injectable()
export class CompetitorRepository extends APIRepository {

    private unusedCompetitors: UnusedCompetitors[] = [];

    constructor(
        private mapper: CompetitorMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'competitors';
    }

    getUrl(tournament: Tournament): string {
        return super.getApiUrl() + 'tournaments/' + tournament.getId() + '/' + this.getUrlpostfix();
    }

    createObject(json: JsonCompetitor, tournament: Tournament): Observable<Competitor> {
        return this.http.post(this.getUrl(tournament), json, this.getOptions()).pipe(
            map((jsonCompetitor: JsonCompetitor) => this.mapper.toObject(jsonCompetitor, tournament)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(competitor: TournamentCompetitor, tournament: Tournament): Observable<Competitor> {
        const url = this.getUrl(tournament) + '/' + competitor.getId();
        return this.http.put(url, this.mapper.toJson(competitor), this.getOptions()).pipe(
            map((jsonCompetitor: JsonCompetitor) => this.mapper.updateObject(jsonCompetitor, competitor)),
            catchError((err) => this.handleError(err))
        );
    }

    getUnusedCompetitors(competition: Competition): Competitor[] {
        let unusedCompetitors = this.unusedCompetitors.find(unusedCompetitor => unusedCompetitor.competition === competition);
        if (unusedCompetitors === undefined) {
            unusedCompetitors = { competition: competition, competitors: [] };
            this.unusedCompetitors.push(unusedCompetitors);
        }
        return unusedCompetitors.competitors;
    }

    removeObject(competitor: Competitor, tournament: Tournament): Observable<void> {
        const url = this.getUrl(tournament) + '/' + competitor.getId();
        return this.http.delete(url, this.getOptions()).pipe(
            map((jsonCompetitor: JsonCompetitor) => {
                const index = tournament.getCompetitors().indexOf(<TournamentCompetitor>competitor);
                if (index > -1) {
                    tournament.getCompetitors().splice(index, 1);
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }
}


export interface UnusedCompetitors {
    competition: Competition;
    competitors: Competitor[];
}
