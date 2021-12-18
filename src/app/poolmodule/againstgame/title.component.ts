import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, CompetitorBase, CompetitorMap, ScoreConfigService, State, Team, TeamCompetitor } from 'ngx-sport';
import { DateFormatter } from '../../lib/dateFormatter';

@Component({
  selector: 'app-againstgame-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class AgainstGameTitleComponent implements OnInit {
  @Input() againstGame!: AgainstGame;
  private competitorMap!: CompetitorMap;

  private scoreConfigService: ScoreConfigService;

  constructor(
    public dateFormatter: DateFormatter
  ) {
    this.scoreConfigService = new ScoreConfigService();
  }

  ngOnInit() {
    const competitors = this.againstGame.getPoule().getCompetition().getTeamCompetitors();
    this.competitorMap = new CompetitorMap(competitors);
    // console.log('competitorMap', this.competitorMap);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes);
  //   if (changes.againstGame.currentValue !== changes.againstGame.previousValue) {
  //     this.updateCompetitorMap(changes.againstGame.currentValue);
  //   }
  // }

  // updateCompetitorMap(againstGame: AgainstGame) {

  // }

  get Finished(): State { return State.Finished; }
  get HomeSide(): AgainstSide { return AgainstSide.Home; }
  get AwaySide(): AgainstSide { return AgainstSide.Away; }


  getCompetitors(side: AgainstSide): (Competitor | undefined)[] {
    return this.againstGame.getSidePlaces(side).map((gamePlace: AgainstGamePlace): Competitor | undefined => {
      if (gamePlace === undefined) {
        return undefined;
      }
      const startLocation = gamePlace.getPlace().getStartLocation();
      return startLocation ? this.competitorMap.getCompetitor(startLocation) : undefined;
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
    if (this.againstGame.getState() !== State.Finished) {
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
