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
import { Competition } from 'ngx-sport';

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

  getActiveViewGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    viewType: GameRoundViewType
  ): Observable<GameRound> {
    const url = this.getUrl(competitionConfig, viewPeriod) + "/gamerounds/active";
    return this.http.get<CurrentGameRounds>(url, this.getOptions()).pipe(
      map((json: CurrentGameRounds): GameRound => {
        let activeGameRound: GameRound | undefined;
        if (viewType == GameRoundViewType.Games) {
          if (json.firstCreatedOrInProgress !== undefined) {
            activeGameRound = json.firstCreatedOrInProgress;
          } else if (json.lastFinishedOrInProgress !== undefined) {
            activeGameRound = json.lastFinishedOrInProgress;
          }
        }
        if (viewType == GameRoundViewType.Ranking) {
          if (json.lastFinishedOrInProgress !== undefined) {
            activeGameRound = json.lastFinishedOrInProgress;
          } else if (json.firstCreatedOrInProgress !== undefined) {
            activeGameRound = json.firstCreatedOrInProgress;
          }
        }
        if (activeGameRound === undefined) {
          throw new Error("no gameRoundNr could be calculated");
        }
        return activeGameRound;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  isActive(competition: Competition, gameRoundNr: number): Observable<boolean> {
    
    const url =
      this.getApiUrl() +
      "public/competitions/" +
      competition.getId() +
      "/active/" +
      gameRoundNr;

      return this.http.get<JsonLeagueActive>(url, this.getOptions()).pipe(
        map((json: JsonLeagueActive) => json.active),
        catchError((err) => this.handleError(err))
      );
    }

}

export interface CurrentGameRounds {
    firstCreatedOrInProgress?: GameRound | undefined,
    lastFinishedOrInProgress?: GameRound | undefined
}

export interface JsonLeagueActive {
  active: boolean;
}