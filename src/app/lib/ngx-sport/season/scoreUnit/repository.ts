// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';

// import { APIRepository } from '../../../repository';
// import { SeasonScoreMapper } from './mapper';
// import { Season } from 'ngx-sport';
// import { SeasonScore } from '../score';
// import { JsonSeasonScore } from './json';

// @Injectable()
// export class SeasonScoreRepository extends APIRepository {

//     constructor(
//         private http: HttpClient,
//         private mapper: SeasonScoreMapper) {
//         super();
//     }

//     getUrlpostfix(): string {
//         return 'scores';
//     }


//     getUrl(season: Season): string {
//         return super.getApiUrl() + 'seasons/' + season.getId() + '/scores';
//     }

//     getObjects(season: Season): Observable<SeasonScore[]> {
//         return this.http.get<JsonSeasonScore[]>(this.getUrl(season), this.getOptions()).pipe(
//             map((jsonScores: JsonSeasonScore[]) => jsonScores.map(jsonScore => {
//                 return this.mapper.toObject(jsonScore, season);
//             })),
//             catchError((err) => this.handleError(err))
//         );
//     }
// }
