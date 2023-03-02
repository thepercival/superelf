import { Component, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AgainstGame, Competition, Poule, Round, Structure, TogetherGame, TogetherGamePlace } from 'ngx-sport';

import { AuthService } from '../../../lib/auth/auth.service';
import { LeagueName } from '../../../lib/leagueName';
import { Pool } from '../../../lib/pool';
import { PoolUser } from '../../../lib/pool/user';
import { NavBarItem } from './items';

@Component({
  selector: 'app-pool-navbar',
  templateUrl: './poolNavBar.component.html',
  styleUrls: ['./poolNavBar.component.scss']
})
export class PoolNavBarComponent {
  @Input() upperNavBar: TemplateRef<any> | undefined;
  @Input() pool!: Pool;
  @Input() poolUser: PoolUser|undefined;
  @Input() current!: NavBarItem;    

  public structureMap = new Map<number, Structure>();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {

  }

  get Competitions(): NavBarItem { return NavBarItem.Competitions }
  get Schedule(): NavBarItem { return NavBarItem.Schedule }
  get Trophies(): NavBarItem { return NavBarItem.Trophies }
  get Rules(): NavBarItem { return NavBarItem.Rules }
  get Admin(): NavBarItem { return NavBarItem.Admin }
  // get LockerRoomsScreen(): TournamentScreen { return TournamentScreen.LockerRooms }
  // get GamesScreen(): TournamentScreen { return TournamentScreen.Games }
  // get RankingScreen(): TournamentScreen { return TournamentScreen.Ranking }
  // get FavoritesScreen(): TournamentScreen { return TournamentScreen.Favorites }
  // get CompetitorsScreen(): TournamentScreen { return TournamentScreen.Competitors }
  // get SettingsScreen(): TournamentScreen { return TournamentScreen.Settings }

  getTextColorClass(item: NavBarItem): string {
    return this.current !== item ? 'btn-outline-success' : 'text-white';
  }

  linkTo(navBarItem: NavBarItem): void {
    switch (navBarItem) {
      case NavBarItem.Competitions:
        this.router.navigate(['/pool/competition', this.pool.getId()]);
        return;
      case NavBarItem.Schedule:
        this.linkToSchedule();
        return;       
      case NavBarItem.Trophies:
        this.router.navigate(['/pool/trophies', this.pool.getId()]);
        return;      
      case NavBarItem.Rules:
        this.router.navigate(['/pool/rules', this.pool.getId()]);
        return;
    }
  }

  linkToSchedule(): void {
    const competition = this.pool.getCompetition(LeagueName.Competition)
    if( competition === undefined) {
      return;
    }
    this.router.navigate(['/pool/allinonegame', this.pool.getId()]);
    // this.router.navigate(['/pool/poule-schedule', this.pool.getId(), LeagueName.Competition, 0]);
}

getCurrentRound(competition: Competition, gameRoundNumber: number): Round|undefined {
  const structure = this.structureMap.get(+competition.getId());
  if( structure === undefined ) {
      return undefined;
  }
  
  const round = structure.getSingleCategory().getRootRound();
  return this.getCurrentRoundHelper(round, gameRoundNumber);
}

getCurrentRoundHelper(round: Round, gameRoundNumber: number): Round|undefined {
  if( this.hasRoundGameRoundNumber(round, gameRoundNumber) ) {
      return round;
  }
  return round.getChildren().find((childRound: Round): boolean => {
      return this.hasRoundGameRoundNumber(childRound, gameRoundNumber);
  });
}

hasRoundGameRoundNumber(round: Round, gameRoundNumber: number): boolean {
  return round.getGames().some((game: (AgainstGame|TogetherGame)): boolean => {
      if( game instanceof TogetherGame) {
          return game.getTogetherPlaces().some((gamePlace: TogetherGamePlace): boolean => {
              return gamePlace.getGameRoundNumber() === gameRoundNumber;
          })
      }
      return game.getGameRoundNumber() === gameRoundNumber;
  });
}

getCurrentPoule(round: Round, leagueName: LeagueName, poolUser: PoolUser): Poule | undefined {
  const competitor = poolUser.getCompetitor(leagueName)
  if (competitor === undefined) {
      return undefined;
  }
  return round.getPoules().find((poule: Poule): boolean => {
      return poule.getPlaceByStartLocation(competitor.getStartLocation()) !== undefined;
  });

}
  
  // hasRole(roles: number): boolean {
  //   const loggedInUserId = this.authService.getLoggedInUserId();
  //   const tournamentUser = loggedInUserId ? this.tournament.getUser(loggedInUserId) : undefined;
  //   return tournamentUser ? tournamentUser.hasARole(roles) : false;
  // }

  // showNrOfItems(): number {
  //   if (!this.public) {
  //     return 4;
  //   }
  //   let nrOfItems = 3;
  //   if (this.tournament.getLockerRooms().length > 0) {
  //     nrOfItems++;
  //   }
  //   return this.tournament.getCompetitors().length > 0 ? nrOfItems + 1 : nrOfItems;
  // }

  // getFavSuffix(): string {
  //   return this.showNrOfItems() > 4 ? 'd-none d-sm-inline' : '';
  // }
}