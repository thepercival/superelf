import { concatMap, Observable, of } from "rxjs";
import { CompetitionConfig } from "../competitionConfig";
import { ViewPeriod } from "../periods/viewPeriod";
import { GameRoundRepository } from "./repository";
import { GameRound } from "../gameRound";
import { GameRoundViewType } from "./viewType";
import { AgainstGame, Poule } from "ngx-sport";
import { GameRepository } from "../ngx-sport/game/repository";

export class SourceGameManager {
  private gameRoundsMap: Map<number, Map<number, AgainstGame[]>> = new Map();

  constructor(private againstGameRepository: GameRepository) {}

  public getAgainstGames(
    poule: Poule, 
    viewPeriod: ViewPeriod,
    gameRoundNr: number
  ): Observable<AgainstGame[]> {
    let gameRoundsMap = this.gameRoundsMap.get(viewPeriod.getId());
    if (gameRoundsMap === undefined) {
      gameRoundsMap = new Map();
      this.gameRoundsMap.set(viewPeriod.getId(), gameRoundsMap);
    }
    return this.againstGameRepository.getSourceObjects(poule, gameRoundNr)
      .pipe(
          concatMap((againstGames: AgainstGame[]) => {
            gameRoundsMap.set(gameRoundNr, againstGames);
            return of(againstGames);
          })
        );
  }
}  