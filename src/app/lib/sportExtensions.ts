import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, Player, StartLocationMap } from 'ngx-sport';
import { S11Player } from './player';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class SportExtensions {
  public getCurrentPlayer(s11Player: S11Player): Player | undefined {
    return this.getPlayer(s11Player, new Date());
  }

  public getPlayer(s11Player: S11Player, date: Date): Player | undefined {
    const checkDate = date ? date : new Date();
    return s11Player.getPlayers().find((player: Player): boolean => {
      return player.isIn(checkDate);
    });
  }

  getCompetitor(
    againstGame: AgainstGame,
    side: AgainstSide
  ): Competitor | undefined {
    // console.log(this.againstGame.getAgainstPlaces());
    // console.log(this.againstGame.getAgainstPlaces().map(ap => ap.getSide()), side);

    const competitors = againstGame
      .getPoule()
      .getCompetition()
      .getTeamCompetitors();
    const startLocationMap: StartLocationMap = new StartLocationMap(
      competitors
    );

    return againstGame
      .getSidePlaces(side)
      .map((gamePlace: AgainstGamePlace): Competitor | undefined => {
        if (gamePlace === undefined) {
          return undefined;
        }
        const startLocation = gamePlace.getPlace().getStartLocation();
        if (startLocation === undefined) {
          return undefined;
        }
        return startLocationMap.getCompetitor(startLocation);
      })
      .find((competitor: Competitor | undefined): boolean => {
        return competitor !== undefined;
      });
  }
}