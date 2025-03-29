import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { CompetitionConfig } from '../competitionConfig';
import { ViewPeriod } from '../periods/viewPeriod';
import { GameRoundMapper } from './mapper';
import { GameRound } from '../gameRound';
import { JsonGameRound } from './json';
import { GameRoundViewType } from './viewType';

@Injectable({
  providedIn: "root",
})
export class GameRoundRepository extends APIRepository {
  constructor(private mapper: GameRoundMapper, private http: HttpClient) {
    super();
  }

  getUrl(competitionConfig: CompetitionConfig, viewPeriod: ViewPeriod): string {
    return (
      this.getApiUrl() +
      "public/competitionconfigs/" +
      competitionConfig.getId() +
      "/viewperiods/" +
      viewPeriod.getId()
    );
  }

  getObjects(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): Observable<GameRound[]> {
    const url = this.getUrl(competitionConfig, viewPeriod) + "/gamerounds";
    return this.http.get<JsonGameRound[]>(url, this.getOptions()).pipe(
      map((jsonGameRounds: JsonGameRound[]) =>
        jsonGameRounds.map((jsonGameRound: JsonGameRound): GameRound => {
          return this.mapper.toObject(jsonGameRound, viewPeriod);
        })
      ),
      catchError((err) => this.handleError(err))
    );
  }

  getActiveViewGameRoundNr(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    viewType: GameRoundViewType
  ): Observable<number> {
    const url =
      this.getUrl(competitionConfig, viewPeriod) + "/gamerounds/active";
    return this.http.get<CurrentGameRoundNumbers>(url, this.getOptions()).pipe(
      map((json: CurrentGameRoundNumbers): number => {
        let activeGameRoundNr: number | undefined;
        if (viewType == GameRoundViewType.Games) {
          if (typeof json.firstCreatedOrInProgress === "number") {
            activeGameRoundNr = json.firstCreatedOrInProgress;
          } else if (typeof json.lastFinishedOrInProgress === "number") {
            activeGameRoundNr = json.lastFinishedOrInProgress;
          }
        }
        if (viewType == GameRoundViewType.Ranking) {
          if (typeof json.lastFinishedOrInProgress === "number") {
            activeGameRoundNr = json.lastFinishedOrInProgress;
          } else if (typeof json.firstCreatedOrInProgress === "number") {
            activeGameRoundNr = json.firstCreatedOrInProgress;
          }
        }
        if (activeGameRoundNr === undefined) {
          throw new Error("no gameRoundNr could be calculated");
        }
        return activeGameRoundNr;
      }),
      catchError((err) => this.handleError(err))
    );
  }
}

export interface CurrentGameRoundNumbers {
    firstCreatedOrInProgress?: number | undefined,
    lastFinishedOrInProgress?: number | undefined
}