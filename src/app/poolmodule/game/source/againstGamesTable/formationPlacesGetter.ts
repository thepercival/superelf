import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, StartLocation, StartLocationMap, Team, TeamCompetitor } from "ngx-sport";
import { CompetitorPoolUserAndFormation } from "../../../poule/againstgames.component";
import { S11FormationPlace } from "../../../../lib/formation/place";

export class FormationPlacesGetter {
  private teamsStartLocationMap: StartLocationMap | undefined;

  public getFormationPlaces(
    againstGame: AgainstGame,
    side: AgainstSide,
    competitorPoolUserAndFormation: CompetitorPoolUserAndFormation
  ): S11FormationPlace[] {
    const formation = competitorPoolUserAndFormation.formation;
    const team = this.getTeam(againstGame, side);
    if (formation === undefined || team === undefined) {
      return [];
    }
    return formation
      .getPlaces()
      .filter((formationPlace: S11FormationPlace): boolean => {
        return formationPlace.getPlayer()?.getPlayer(team) !== undefined;
      });
  }

  private getTeam(
    againstGame: AgainstGame, side: AgainstSide
  ): Team | undefined {
    const sideGamePlaces: AgainstGamePlace[] = againstGame.getSidePlaces(side);
    const teams = sideGamePlaces.map(
      (againstGamePlace: AgainstGamePlace): Team | undefined => {
        const startLocation = againstGamePlace.getPlace().getStartLocation();
        if (startLocation === undefined) {
          return undefined;
        }
        const competitor = this.getTeamCompetitor(againstGame, startLocation);
        return competitor?.getTeam();
      }
    );
    return teams.find((team: Team | undefined): boolean => team !== undefined);
  }

  private getTeamCompetitor(
    againstGame: AgainstGame,
    teamStartLocation: StartLocation
  ): TeamCompetitor | undefined {
    if (this.teamsStartLocationMap === undefined) {
      const teamCompetitors = againstGame
        .getPoule()
        .getCompetition()
        .getTeamCompetitors();
      this.teamsStartLocationMap = new StartLocationMap(teamCompetitors);
    }
    const competitor =
      this.teamsStartLocationMap.getCompetitor(teamStartLocation);
    return this.convertToTeamCompetitor(competitor);
  }

  private convertToTeamCompetitor(
    sideCompetitor: Competitor | undefined
  ): TeamCompetitor | undefined {
    if (this.isTeamCompetitor(sideCompetitor)) {
      return <TeamCompetitor>sideCompetitor;
    }
    return undefined;
  }

  private isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }
}