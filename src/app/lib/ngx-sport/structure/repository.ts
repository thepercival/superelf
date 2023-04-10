import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { StructureMapper, Structure, JsonStructure, Competition, Round, Poule } from 'ngx-sport';
import { APIRepository } from '../../repository';

@Injectable({
    providedIn: 'root'
})
export class StructureRepository extends APIRepository {

    constructor(
        private mapper: StructureMapper,
        private http: HttpClient) {
        super();
    }

    getUrl(competition: Competition, suffix: string): string {
        return this.getApiUrl() + 'public/competitions/' + competition.getId() + '/' + suffix;
    }

    getObject(competition: Competition): Observable<Structure> {
        return this.http.get<JsonStructure>(this.getUrl(competition, 'structure'), this.getOptions()).pipe(
            map((json: JsonStructure) => {
                return this.mapper.toObject(json, competition);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getFirstPouleId(competition: Competition): Observable<number> {
        return this.http.get<JsonStructure>(this.getUrl(competition, 'firstpouleid'), this.getOptions()).pipe(
            map((json: any) => {
                return json.firstPouleId;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    public getPouleFromPouleId(round: Round, pouleId: number): Poule {
        const foundRound = this.getRoundWithPouleId(round, pouleId);
        if( foundRound === undefined) {
          throw new Error('poule not found for pouleId ' + pouleId);
        }
        const poule = foundRound.getPoules().find((poule: Poule): boolean => poule.getId() === pouleId);
        if( poule !== undefined ) {
          return poule;
        }
        throw new Error('poule not found for pouleId ' + pouleId);
      }
    
    private getRoundWithPouleId(round: Round, pouleId: number): Round|undefined {
        const poule = round.getPoules().find((poule: Poule): boolean => poule.getId() === pouleId);
        if( poule !== undefined ) {
          return round;
        }
        let foundRound = undefined;
        round.getChildren().some((childRound: Round): boolean => {
          const foundChildRound = this.getRoundWithPouleId(childRound, pouleId);
          if( foundChildRound !== undefined) {
            foundRound = foundChildRound;
            return true;
          }
          return false;
        });
        return foundRound;
    }
}
