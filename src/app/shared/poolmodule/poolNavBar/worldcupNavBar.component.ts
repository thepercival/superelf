import { Component, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { Router } from '@angular/router';
import { AgainstGame, Competition, Poule, Round, Structure, TogetherGame, TogetherGamePlace } from 'ngx-sport';
import { Badge } from '../../../lib/achievement/badge';
import { AchievementRepository } from '../../../lib/achievement/repository';
import { Trophy } from '../../../lib/achievement/trophy';

import { AuthService } from '../../../lib/auth/auth.service';
import { LeagueName } from '../../../lib/leagueName';
import { Pool } from '../../../lib/pool';
import { PoolUser } from '../../../lib/pool/user';
import { S11Storage } from '../../../lib/storage';
import { NavBarItem } from './items';
import { SuperElfNameService } from '../../../lib/nameservice';
import { WorldCupPreviousService } from '../../commonmodule/worldCupPreviousService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SuperElfTrophyIconComponent } from '../icon/trophy.component';
import { SuperElfIconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  selector: "app-worldcup-navbar",
  imports: [
    FontAwesomeModule,
    SuperElfTrophyIconComponent,
    SuperElfIconComponent,
  ],
  templateUrl: "./worldcupNavBar.component.html",
  styleUrls: ["./worldcupNavBar.component.scss"],
})
export class WorldCupNavBarComponent implements OnInit, OnChanges {
  readonly pool = input.required<Pool>();
  readonly poolUser = input<PoolUser>();
  readonly current = input.required<NavBarItem>();

  public structureMap = new Map<number, Structure>();
  public hasUnviewedAchievements: boolean = false;
  public latestGetUnviewedRequest: Date | undefined;

  constructor(
    public authService: AuthService,
    private router: Router,
    private achievementRepository: AchievementRepository,
    private s11Storage: S11Storage,
    protected worldCupPreviousService: WorldCupPreviousService,
    public nameService: SuperElfNameService
  ) {}

  ngOnInit() {}

  get WorldCup(): LeagueName {
    return LeagueName.WorldCup;
  }
  get Competitions(): NavBarItem {
    return NavBarItem.Competitions;
  }
  get Schedule(): NavBarItem {
    return NavBarItem.Schedule;
  }
  get Achievements(): NavBarItem {
    return NavBarItem.Achievements;
  }
  get Rules(): NavBarItem {
    return NavBarItem.Rules;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.poolUser !== undefined &&
      changes.poolUser.currentValue !== changes.poolUser.previousValue
    ) {
      if (changes.poolUser.currentValue !== undefined) {
        this.getHasUnviewedAchievements(changes.poolUser.currentValue);
      }
    }
  }

  private getHasUnviewedAchievements(poolUser: PoolUser): void {
    const latestRequest = this.s11Storage.getLatest(poolUser.getPool());
    const checkDate = new Date();
    checkDate.setHours(checkDate.getHours() - 1);
    if (
      latestRequest === undefined ||
      latestRequest.date.getTime() < checkDate.getTime()
    ) {
      this.achievementRepository
        .getUnviewedObjects(poolUser.getPool())
        .subscribe({
          next: (achievements: (Trophy | Badge)[]) => {
            this.hasUnviewedAchievements = achievements.length > 0;
            this.s11Storage.setLatest(
              poolUser.getPool(),
              new Date(),
              achievements.length > 0
            );
          },
        });
    } else {
      this.hasUnviewedAchievements = latestRequest.has;
    }
  }

  getTextColorClass(item: NavBarItem): string {
    return this.current() !== item ? "btn-outline-success" : "text-white";
  }

  linkTo(navBarItem: NavBarItem): void {
    switch (navBarItem) {
      case NavBarItem.Competitions:
        this.router.navigate(["/pool/allinonegame", this.pool().getId()]);
        return;
      case NavBarItem.Schedule:
        this.linkToSchedule();
        return;
      case NavBarItem.Achievements:
        this.router.navigate(["/pool/achievements", this.pool().getId()]);
        return;
      case NavBarItem.Rules:
        const previousPoolId = this.worldCupPreviousService.getPreviousPoolId();
        if (previousPoolId !== undefined) {
          this.router.navigate(["/pool/competition", previousPoolId]);
        } else {
          this.router.navigate(["/"]);
        }
        return;
    }
  }

  linkToSchedule(): void {
    const worldCup = this.pool().getCompetition(LeagueName.WorldCup);
    if (worldCup === undefined) {
      return;
    }
    this.router.navigate(["/pool/allinonegame", this.pool().getId()]);
  }

  getCurrentRound(
    competition: Competition,
    gameRoundNumber: number
  ): Round | undefined {
    const structure = this.structureMap.get(+competition.getId());
    if (structure === undefined) {
      return undefined;
    }

    const round = structure.getSingleCategory().getRootRound();
    return this.getCurrentRoundHelper(round, gameRoundNumber);
  }

  getCurrentRoundHelper(
    round: Round,
    gameRoundNumber: number
  ): Round | undefined {
    if (this.hasRoundGameRoundNumber(round, gameRoundNumber)) {
      return round;
    }
    return round.getChildren().find((childRound: Round): boolean => {
      return this.hasRoundGameRoundNumber(childRound, gameRoundNumber);
    });
  }

  hasRoundGameRoundNumber(round: Round, gameRoundNumber: number): boolean {
    return round
      .getGames()
      .some((game: AgainstGame | TogetherGame): boolean => {
        if (game instanceof TogetherGame) {
          return game
            .getTogetherPlaces()
            .some((gamePlace: TogetherGamePlace): boolean => {
              return gamePlace.getGameRoundNumber() === gameRoundNumber;
            });
        }
        return game.getGameRoundNumber() === gameRoundNumber;
      });
  }

  getCurrentPoule(
    round: Round,
    leagueName: LeagueName,
    poolUser: PoolUser
  ): Poule | undefined {
    const competitor = poolUser.getCompetitor(leagueName);
    if (competitor === undefined) {
      return undefined;
    }
    return round.getPoules().find((poule: Poule): boolean => {
      return (
        poule.getPlaceByStartLocation(competitor.getStartLocation()) !==
        undefined
      );
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
