import { Component, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AgainstGame, Competition, Poule, Round, Structure, TogetherGame, TogetherGamePlace } from 'ngx-sport';

import { AuthService } from '../../../lib/auth/auth.service';
import { LeagueName } from '../../../lib/leagueName';
import { SuperElfNameService } from '../../../lib/nameservice';
import { Pool } from '../../../lib/pool';
import { PoolUser } from '../../../lib/pool/user';
import { Role } from '../../../lib/role';
import { CompetitionsNavBarItem } from './items';

@Component({
  selector: 'app-competitions-navbar',
  templateUrl: './competitionsNavBar.component.html',
  styleUrls: ['./competitionsNavBar.component.scss']
})
export class PoolCompetitionsNavBarComponent {
  @Input() pool!: Pool;
  @Input() poolUser: PoolUser|undefined;
  @Input() current: CompetitionsNavBarItem|undefined;

  public hasSuperCup = true;
  public hasWorldCup = true;

  public structureMap = new Map<number, Structure>();

  constructor(
    public authService: AuthService,
    private router: Router,
    public nameService: SuperElfNameService,
  ) {

  }

  get Competition(): LeagueName { return LeagueName.Competition };
  get Cup(): LeagueName { return LeagueName.Cup };
  get SuperCup(): LeagueName { return LeagueName.SuperCup };
  get WorldCup(): LeagueName { return LeagueName.WorldCup };

  get PouleRankingTogetherSport(): CompetitionsNavBarItem { return CompetitionsNavBarItem.PouleRankingTogetherSport }
  get CupStructure(): CompetitionsNavBarItem { return CompetitionsNavBarItem.CupStructure }
  get SuperCupGame(): CompetitionsNavBarItem { return CompetitionsNavBarItem.SuperCupGame }
  get WorldCupStructure(): CompetitionsNavBarItem { return CompetitionsNavBarItem.WorldCupStructure }
  
  getTextColorClass(item: CompetitionsNavBarItem): string {
    return this.current !== item ? 'btn-outline-success' : 'text-white';
  }

  linkTo(navBarItem: CompetitionsNavBarItem): void {
    switch (navBarItem) {
      case CompetitionsNavBarItem.PouleRankingTogetherSport:
        this.router.navigate(['/pool/competition', this.pool.getId()]);
        return;
      case CompetitionsNavBarItem.CupStructure:
        this.router.navigate(['/pool/cup', this.pool.getId()]);
        return;       
      case CompetitionsNavBarItem.SuperCupGame:
        this.router.navigate(['/pool/poule-againstgames', this.pool.getId(), LeagueName.SuperCup, 0]);
        return;      
      case CompetitionsNavBarItem.WorldCupStructure:
        this.router.navigate(['/pool/worldcup', this.pool.getId(), this.pool.getSeason().getId()]);
        return;
    }
  }

//   linkToSchedule(): void {
//     const competition = this.pool.getCompetition(LeagueName.Competition)
//     if( competition === undefined) {
//       return;
//     }
//     this.router.navigate(['/pool/allinonegame', this.pool.getId()]);
//     // this.router.navigate(['/pool/poule-schedule', this.pool.getId(), LeagueName.Competition, 0]);
// }

// getCurrentRound(competition: Competition, gameRoundNumber: number): Round|undefined {
//   const structure = this.structureMap.get(+competition.getId());
//   if( structure === undefined ) {
//       return undefined;
//   }
  
//   const round = structure.getSingleCategory().getRootRound();
//   return this.getCurrentRoundHelper(round, gameRoundNumber);
// }

// getCurrentRoundHelper(round: Round, gameRoundNumber: number): Round|undefined {
//   if( this.hasRoundGameRoundNumber(round, gameRoundNumber) ) {
//       return round;
//   }
//   return round.getChildren().find((childRound: Round): boolean => {
//       return this.hasRoundGameRoundNumber(childRound, gameRoundNumber);
//   });
// }

// hasRoundGameRoundNumber(round: Round, gameRoundNumber: number): boolean {
//   return round.getGames().some((game: (AgainstGame|TogetherGame)): boolean => {
//       if( game instanceof TogetherGame) {
//           return game.getTogetherPlaces().some((gamePlace: TogetherGamePlace): boolean => {
//               return gamePlace.getGameRoundNumber() === gameRoundNumber;
//           })
//       }
//       return game.getGameRoundNumber() === gameRoundNumber;
//   });
// }

// getCurrentPoule(round: Round, leagueName: LeagueName, poolUser: PoolUser): Poule | undefined {
//   const competitor = poolUser.getCompetitor(leagueName)
//   if (competitor === undefined) {
//       return undefined;
//   }
//   return round.getPoules().find((poule: Poule): boolean => {
//       return poule.getPlaceByStartLocation(competitor.getStartLocation()) !== undefined;
//   });
// }
  
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
