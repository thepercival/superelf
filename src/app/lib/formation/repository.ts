import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Sport } from 'ngx-sport';


@Injectable()
export class FormationRepository extends APIRepository {
    protected possibleSuperElfFormations: Formation[];

    constructor(
        private mapper: FormationMapper, private http: HttpClient) {
        super();
    }

    getUrl(sport: Sport): string {
        return super.getApiUrl() + 'sports/' + sport.getId() + '/formations';
    }

    // getObjects(sport: Sport): Formation[] {
    //     if (this.possibleSuperElfFormations === undefined) {
    //         const json: JsonFormation[] = [
    //             {
    //                 name: "5-3-2",
    //                 lines: [
    //                     { number: Team.Line_Goalkeeper, nrOfPlayers: 1 },
    //                     { number: Team.Line_Defense, nrOfPlayers: 5 },
    //                     { number: Team.Line_Midfield, nrOfPlayers: 3 },
    //                     { number: Team.Line_Forward, nrOfPlayers: 2 }
    //                 ]
    //             },
    //             {
    //                 name: "5-3-2",
    //                 lines: [
    //                     { number: Team.Line_Goalkeeper, nrOfPlayers: 1 },
    //                     { number: Team.Line_Defense, nrOfPlayers: 5 },
    //                     { number: Team.Line_Midfield, nrOfPlayers: 3 },
    //                     { number: Team.Line_Forward, nrOfPlayers: 2 }
    //                 ]
    //             },
    //             {
    //                 name: "5-3-2",
    //                 lines: [
    //                     { number: Team.Line_Goalkeeper, nrOfPlayers: 1 },
    //                     { number: Team.Line_Defense, nrOfPlayers: 5 },
    //                     { number: Team.Line_Midfield, nrOfPlayers: 3 },
    //                     { number: Team.Line_Forward, nrOfPlayers: 2 }
    //                 ]
    //             },
    //             {
    //                 name: "5-3-2",
    //                 lines: [
    //                     { number: Team.Line_Goalkeeper, nrOfPlayers: 1 },
    //                     { number: Team.Line_Defense, nrOfPlayers: 5 },
    //                     { number: Team.Line_Midfield, nrOfPlayers: 3 },
    //                     { number: Team.Line_Forward, nrOfPlayers: 2 }
    //                 ]
    //             },
    //             {
    //                 name: "5-3-2",
    //                 lines: [
    //                     { number: Team.Line_Goalkeeper, nrOfPlayers: 1 },
    //                     { number: Team.Line_Defense, nrOfPlayers: 5 },
    //                     { number: Team.Line_Midfield, nrOfPlayers: 3 },
    //                     { number: Team.Line_Forward, nrOfPlayers: 2 }
    //                 ]
    //             }
    //         ];
    //         // const formation532 = new Formation(sport, );
    //         // new Form
    //         // const formation352 = new Formation(sport, "3-5-2"); 
    //         // const formation433 = new Formation(sport, "4-3-3"); 
    //         // const formation343 = new Formation(sport, "3-4-3"); 
    //         // const formation442 = new Formation(sport, "4-4-2"); 

    //         this.possibleSuperElfFormations = [
    //             formation532, formation352, formation433, formation343, formation442
    //         ]
    //     }
    //     return this.possibleSuperElfFormations;
    // }

    getObjects(sport: Sport): Observable<Formation[]> {
        return this.http.get(this.getUrl(sport), this.getOptions()).pipe(
            map((jsonFormations: JsonFormation[]) => jsonFormations.map(jsonFormation => {
                return this.mapper.toObject(jsonFormation, sport);
            })),
            catchError((err) => this.handleError(err))
        );
    }
}
