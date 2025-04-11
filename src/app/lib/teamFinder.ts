import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, StartLocationMap, Team, TeamCompetitor } from "ngx-sport";

export class TeamFinder
{
    private startLocationMap!: StartLocationMap;

  constructor(teamCompetitors: TeamCompetitor[]) {
    this.startLocationMap = new StartLocationMap(teamCompetitors);
  }

  public findTeam(againstGame: AgainstGame, side: AgainstSide): Team | undefined {
    
    const teams = againstGame.getSidePlaces(side).map((gamePlace: AgainstGamePlace): Team|undefined => {        
      const startLocation = gamePlace.getPlace().getStartLocation();
      if( startLocation === undefined) {
        return undefined;
      }
      const competitor: Competitor|undefined = this.startLocationMap.getCompetitor(startLocation);
      return this.getTeam(competitor);
    });
    return teams.find(team => team !== undefined );
  }

  getTeam(sideCompetitor: Competitor | undefined): Team | undefined {
    const teamCompetitor = this.getTeamCompetitor(sideCompetitor);
    return teamCompetitor?.getTeam() ?? undefined;
  }
  getTeamCompetitor(sideCompetitor: Competitor | undefined): TeamCompetitor | undefined {
    if (this.isTeamCompetitor(sideCompetitor)) {
      return <TeamCompetitor>sideCompetitor;
    }
    return undefined;
  }
  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }
}