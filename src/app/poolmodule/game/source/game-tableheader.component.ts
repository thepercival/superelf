import { Component, OnInit, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgainstGame, AgainstSide, Competitor, CompetitorBase, GameState, NameService, Team, TeamCompetitor } from 'ngx-sport';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { SportExtensions } from '../../../lib/sportExtensions';
import { DateFormatter } from '../../../lib/dateFormatter';
import { TeamNameComponent } from '../../team/name.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { SuperElfNameService } from '../../../lib/nameservice';

@Component({
  selector: "[s11-game-tableheader]",
  standalone: true,
  imports: [FontAwesomeModule,TeamNameComponent,NgTemplateOutlet,NgClass],
  templateUrl: "./game-tableheader.component.html",
  styleUrls: ["./game-tableheader.component.scss"],
})
export class GameTableHeaderComponent implements OnInit {
  readonly againstGame = input.required<AgainstGame>();
  readonly scrollTo = input<AgainstGame>();

  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

  constructor(
    public sportExtensions: SportExtensions,
    public dateFormatter: DateFormatter,
    public s11NameService: SuperElfNameService
  ) {}

  get Finished(): GameState { return GameState.Finished; }
  get HomeSide(): AgainstSide { return AgainstSide.Home; }
  get AwaySide(): AgainstSide { return AgainstSide.Away; }

  ngOnInit() {
    // this.games().slice().every((game: AgainstGame): boolean => {
    //   if( game.getState() !== GameState.Finished ) {
    //     return false;
    //   }
    //   this.games().shift()
    //   this.games().push(game);
    //   return true;
    // });
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
}
