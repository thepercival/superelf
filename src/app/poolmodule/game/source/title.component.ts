import { Component, Input, OnInit } from '@angular/core';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, CompetitorBase, ScoreConfigService, GameState, Team, TeamCompetitor, StartLocationMap } from 'ngx-sport';
import { DateFormatter } from '../../../lib/dateFormatter';
import { SuperElfNameService } from '../../../lib/nameservice';

@Component({
  selector: 'app-againstgame-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class AgainstGameTitleComponent implements OnInit {
  @Input() againstGame!: AgainstGame;
  @Input() showDate: boolean = true;
  @Input() showFinishedDate: boolean = true;
  private startLocationMap!: StartLocationMap;

  constructor(
    public dateFormatter: DateFormatter,
    public nameService: SuperElfNameService
  ) {

  }

  ngOnInit() {
    const competitors = this.againstGame.getPoule().getCompetition().getTeamCompetitors();
    this.startLocationMap = new StartLocationMap(competitors);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.againstGame.currentValue !== changes.againstGame.previousValue) {
  //     this.updateCompetitorMap(changes.againstGame.currentValue);
  //   }
  // }

  // updateCompetitorMap(againstGame: AgainstGame) {

  // }

  get Finished(): GameState { return GameState.Finished; }
  get HomeSide(): AgainstSide { return AgainstSide.Home; }
  get AwaySide(): AgainstSide { return AgainstSide.Away; }


  getCompetitors(side: AgainstSide): (Competitor | undefined)[] {
    // console.log(this.againstGame.getAgainstPlaces());
    // console.log(this.againstGame.getAgainstPlaces().map(ap => ap.getSide()), side);
    return this.againstGame.getSidePlaces(side).map((gamePlace: AgainstGamePlace): Competitor | undefined => {
      if (gamePlace === undefined) {
        return undefined;
      }
      const startLocation = gamePlace.getPlace().getStartLocation();
      return startLocation ? this.startLocationMap.getCompetitor(startLocation) : undefined;
    });
  }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }

  getTeamCompetitor(sideCompetitor: Competitor | undefined): TeamCompetitor | undefined {
    if (this.isTeamCompetitor(sideCompetitor)) {
      return <TeamCompetitor>sideCompetitor;
    }
    return undefined;
  }

  getTeam(sideCompetitor: Competitor | undefined): Team | undefined {
    const teamCompetitor = this.getTeamCompetitor(sideCompetitor);
    return teamCompetitor?.getTeam() ?? undefined;
  }



  // getName(team: Team): string {
  //   return this.fullName ? team.getName() : team.getAbbreviation() ?? '';
  // }

  // getImageUrl(team: Team): string {
  //   return this.imageRepository.getTeamUrl(team);
  // }
}
