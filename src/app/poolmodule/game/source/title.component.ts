import { Component, Input, OnInit } from '@angular/core';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, CompetitorBase, ScoreConfigService, GameState, Team, TeamCompetitor, StartLocationMap } from 'ngx-sport';
import { DateFormatter } from '../../../lib/dateFormatter';

@Component({
  selector: 'app-againstgame-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class AgainstGameTitleComponent implements OnInit {
  @Input() againstGame!: AgainstGame;
  private startLocationMap!: StartLocationMap;

  private scoreConfigService: ScoreConfigService;

  constructor(
    public dateFormatter: DateFormatter
  ) {
    this.scoreConfigService = new ScoreConfigService();
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

  getAgainstScore(): string {
    if (this.againstGame.getState() !== GameState.Finished) {
      return ' vs ';
    }
    const score = ' - ';
    const finalScore = this.scoreConfigService.getFinalAgainstScore(this.againstGame);
    if (finalScore === undefined) {
      return score;
    }
    return finalScore.getHome() + score + finalScore.getAway();
  }

  // getName(team: Team): string {
  //   return this.fullName ? team.getName() : team.getAbbreviation() ?? '';
  // }

  // getImageUrl(team: Team): string {
  //   return this.imageRepository.getTeamUrl(team);
  // }
}
