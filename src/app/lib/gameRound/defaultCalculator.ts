import { Injectable } from "@angular/core";
import { catchError, concatMap, Observable, of } from "rxjs";
import { CompetitionConfig } from "../competitionConfig";
import { GameRound } from "../gameRound";
import { ViewPeriod } from "../period/view";
import { CurrentGameRoundNumbers, GameRoundRepository } from "./repository";

@Injectable({
    providedIn: 'root'
})
export class DefaultGameRoundCalculator
{
    constructor(private gameRoundRepository: GameRoundRepository) 
    {
        
    }

    public calculateSchedule(
        competitionConfig: CompetitionConfig,
        viewPeriod: ViewPeriod, 
        defaultGameRoundNr: number|undefined): Observable<GameRound> {

        if (defaultGameRoundNr !== undefined && defaultGameRoundNr > 0) {
          return of(viewPeriod.getGameRound(defaultGameRoundNr));
        }

        return this.gameRoundRepository.getCurrentNumbers(competitionConfig, viewPeriod).pipe(
            concatMap((json: CurrentGameRoundNumbers) => {

                let currentGameRound;        
                
                if (json.lastFinishedOrInPorgress ) {
                    if (typeof json.lastFinishedOrInPorgress === 'number') {
                        currentGameRound = viewPeriod.getGameRound(json.lastFinishedOrInPorgress);
                    }
                } else if (json.firstCreatedOrInProgress) {
                    if (typeof json.firstCreatedOrInProgress === 'number') {
                        currentGameRound = viewPeriod.getGameRound(json.firstCreatedOrInProgress);
                    }
                }
                if( currentGameRound === undefined ) {
                    throw new Error('no gameRoundNr could be calculated');
                }
                return of(currentGameRound);
            })
        );
      }

      public calculateFinished(
        competitionConfig: CompetitionConfig,
        viewPeriod: ViewPeriod, 
        defaultGameRoundNr: number|undefined): Observable<GameRound> {

        if (defaultGameRoundNr !== undefined && defaultGameRoundNr > 0) {
          return of(viewPeriod.getGameRound(defaultGameRoundNr));
        }

        return this.gameRoundRepository.getCurrentNumbers(competitionConfig, viewPeriod).pipe(
            concatMap((json: CurrentGameRoundNumbers) => {

                let currentGameRound;        
                
                if (json.lastFinishedOrInPorgress ) {
                    if (typeof json.lastFinishedOrInPorgress === 'number') {
                        currentGameRound = viewPeriod.getGameRound(json.lastFinishedOrInPorgress);
                    }
                } else if (json.firstCreatedOrInProgress) {
                    if (typeof json.firstCreatedOrInProgress === 'number') {
                        currentGameRound = viewPeriod.getGameRound(json.firstCreatedOrInProgress);
                    }
                }
                if( currentGameRound === undefined ) {
                    throw new Error('no gameRoundNr could be calculated');
                }
                return of(currentGameRound);
            })
        );
      }

}