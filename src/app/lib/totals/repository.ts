import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BadgeCategory } from '../achievement/badge/category';
import { GameRound } from '../gameRound';
import { ViewPeriod } from '../periods/viewPeriod';

import { Pool } from '../pool';
import { APIRepository } from '../repository';
import { ScorePointsMap } from '../score/points';
import { Totals } from '../totals';
import { JsonTotals } from './json';
import { TotalsMapper } from './mapper';


@Injectable({
  providedIn: "root",
})
export class PoolTotalsRepository extends APIRepository {
  private url: string;

  constructor(private totalsMapper: TotalsMapper, private http: HttpClient) {
    super();
    this.url = super.getApiUrl() + this.getUrlpostfix();
  }

  getUrlpostfix(): string {
    return "public/pools";
  }

  getGameRoundUrl(pool: Pool, gameRound: GameRound): string {
    return (
      this.url +
      "/" +
      pool.getId() +
      "/viewperiods/" +
      gameRound.viewPeriod.getId() +
      "/gamerounds/" +
      gameRound.number +
      "/totals"
    );
  }

  getViewPeriodUrl(pool: Pool, viewPeriod: ViewPeriod): string {
    return (
      this.url +
      "/" +
      pool.getId() +
      "/viewperiods/" +
      viewPeriod.getId() +
      "/totals"
    );
  }

  getViewPeriodPoolUsersMap(
    pool: Pool,
    viewPeriod: ViewPeriod
  ): Observable<PoolUsersTotalsMap> {
    const url = this.getViewPeriodUrl(pool, viewPeriod);
    return this.http
      .get<JsonPoolUserTotals[]>(url, { headers: super.getHeaders() })
      .pipe(
        map((jsonGameRoundPoolUsersTotals: JsonPoolUserTotals[]) => {
          return this.mapPoolUsersTotals(jsonGameRoundPoolUsersTotals, 0);
        }),
        catchError((err) => this.handleError(err))
      );
  }

  getGameRoundPoolUsersMap(
    pool: Pool,
    gameRound: GameRound
  ): Observable<PoolUsersTotalsMap> {
    const url = this.getGameRoundUrl(pool, gameRound);
    return this.http
      .get<JsonPoolUserTotals[]>(url, { headers: super.getHeaders() })
      .pipe(
        map((jsonGameRoundPoolUsersTotals: JsonPoolUserTotals[]) => {
          return this.mapPoolUsersTotals(jsonGameRoundPoolUsersTotals, gameRound.number);
        }),
        catchError((err) => this.handleError(err))
      );
  }

  protected mapPoolUsersTotals(
    jsonGameRoundPoolUsersTotals: JsonPoolUserTotals[],
    gameRoundNr: number
  ): PoolUsersTotalsMap {
    const map = new PoolUsersTotalsMap(gameRoundNr);
    //console.log('pre gameRoundPoolUsersTotals');
    jsonGameRoundPoolUsersTotals.forEach(
      (jsonPoolUserTotals: JsonPoolUserTotals) => {
        const formationLineMap = new FormationLineTotalsMap();
        jsonPoolUserTotals.formationLineTotals.forEach(
          (json: JsonFormationLineTotals) => {
            formationLineMap.set(
              json.line,
              this.totalsMapper.toObject(json.totals)
            );
          }
        );
        map.set(jsonPoolUserTotals.poolUserId, formationLineMap);
      }
    );
    // gameRoundFormationLineTotals: GameRoundFormationLineTotals
    //console.log('check gameRoundPoolUsersTotals', map);
    return map;
  }
}

// string is viewPeriod-gameRoundNr
export class GameRoundTotalsMap extends Map<string, PoolUsersTotalsMap> {    
}

// string|number is poolUserId
export class PoolUsersTotalsMap extends Map<string|number, FormationLineTotalsMap> {    
    constructor(public gameRoundNr: number) {
        super();
    }
    
    add(poolUsersTotalsMap: PoolUsersTotalsMap): void {
        poolUsersTotalsMap.forEach((formationLineTotalsMap: FormationLineTotalsMap, poolUserId: string|number) => {
            const thisFormationLineTotalsMap = this.get(poolUserId);
            if( thisFormationLineTotalsMap === undefined) {
                return;
            }
            thisFormationLineTotalsMap.add(formationLineTotalsMap);
        });
    }    
}

export class FormationLineTotalsMap extends Map<FootballLine, Totals> {
    getPoints(scorePointsMap: ScorePointsMap, badgeCategory: BadgeCategory|undefined): number {
        let points = 0;
        Object.values(FootballLine).forEach((footbalLine: FootballLine|string) => {
            const totals = this.get(+footbalLine);
            if( totals !== undefined) {
                points += totals.getPoints(+footbalLine, scorePointsMap, badgeCategory)
            }
            
        });
        return points;
    }

    add(formationLineTotalsMap: FormationLineTotalsMap): void {
        formationLineTotalsMap.forEach((totals: Totals, footballLine: FootballLine) => {
            const thisTotals = this.get(footballLine);
            if( thisTotals === undefined) {
                return;
            }
            this.set(footballLine, thisTotals.add(totals) );
        });
    }
}

export interface JsonPoolUserTotals {
    poolUserId: string|number,
    formationLineTotals: JsonFormationLineTotals[]
}

export interface JsonFormationLineTotals {
    line: FootballLine,
    totals: JsonTotals
}