import { Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation, input, model } from '@angular/core';
import { Router } from '@angular/router';
import { AgainstGame, Competition, Poule, Round, Structure, TogetherGame, TogetherGamePlace } from 'ngx-sport';
import { Badge } from '../../../lib/achievement/badge';
import { AchievementRepository } from '../../../lib/achievement/repository';
import { Trophy } from '../../../lib/achievement/trophy';
import { SuperElfTrophyIconComponent } from '../icon/trophy.component';

import { AuthService } from '../../../lib/auth/auth.service';
import { LeagueName } from '../../../lib/leagueName';
import { Pool } from '../../../lib/pool';
import { PoolUser } from '../../../lib/pool/user';
import { S11Storage } from '../../../lib/storage';
import { NavBarItem } from './items';
import { SuperElfIconComponent } from '../icon/icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarAlt, faEnvelope, faInfoCircle, faRightLeft, faUsers, faUserSecret, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { facStructure, facTrophy } from '../icons';
import { forkJoin } from 'rxjs';
import { GameRound } from '../../../lib/gameRound';
import { GameRoundRepository } from '../../../lib/gameRound/repository';
import { SuperElfNameService } from '../../../lib/nameservice';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: "app-pool-navbar",
  imports: [FontAwesomeModule, SuperElfIconComponent, SuperElfTrophyIconComponent, NgbPopoverModule],
  templateUrl: "./poolNavBar.component.html",
  styleUrls: ["./poolNavBar.component.scss"],
})
export class PoolNavBarComponent implements OnInit, OnChanges {
  readonly pool = input.required<Pool>();
  readonly poolUser = input<PoolUser>();
  readonly current = input<NavBarItem>();
  readonly currentGameRound = input<GameRound>();
  readonly cupActive = model<boolean>(false);
  readonly superCupActive = model<boolean>(false);

  public structureMap = new Map<number, Structure>();
  public hasUnviewedAchievements: boolean = false;
  public latestGetUnviewedRequest: Date | undefined;  
  public hasSuperCup = true;
  public faInfoCircle = faInfoCircle;
  public facTrophy = facTrophy;
  public facStructure = facStructure;
  public faCalendarAlt = faCalendarAlt;
  public faUsers = faUsers;
  public faUserSecret = faUserSecret;
  public faEnvelope = faEnvelope;
  public faRightLeft = faRightLeft;
  public faEllipsisVertical = faEllipsisVertical;

  constructor(
    public authService: AuthService,
    private router: Router,
    private achievementRepository: AchievementRepository,
    public gameRoundRepository: GameRoundRepository,
    private s11Storage: S11Storage,
    public nameService: SuperElfNameService
  ) {}

  ngOnInit() {
    const gameRound = this.currentGameRound();
    if( gameRound === undefined ) {
      return;
    }
    const gameRoundNrs = [gameRound.number];
    if( gameRound.created) {
      gameRoundNrs.push(gameRound.number-1);
    }
    if (gameRound.finished) {
      gameRoundNrs.push(gameRound.number+1);
    }

    const superCup = this.pool().getCompetition(LeagueName.SuperCup);
    this.hasSuperCup = superCup !== undefined;
    if (superCup !== undefined) {
  
      const superCupRequests = gameRoundNrs.map((gameRoundNr: number) => {
        return this.gameRoundRepository.isActive(superCup, gameRoundNr)          
      });
      forkJoin(superCupRequests).subscribe({
        next: (actives: boolean[]) => {
          this.superCupActive.set(actives.some((active) => active));
        },
      });
    }

    const cup = this.pool().getCompetition(LeagueName.Cup);
    if (cup !== undefined) {
      const cupRequests = gameRoundNrs.map((gameRoundNr: number) => {
        return this.gameRoundRepository.isActive(cup, gameRoundNr);
      });
      forkJoin(cupRequests).subscribe({
        next: (actives: boolean[]) => {
          this.cupActive.set(actives.some((active) => active));
        },
      });
    }
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
    // console.log(checkDate, latestRequest);
    if (
      latestRequest === undefined ||
      latestRequest.date.getTime() < checkDate.getTime()
    ) {
      this.achievementRepository
        .getUnviewedObjects(poolUser.getPool())
        .subscribe({
          next: (achievements: (Trophy | Badge)[]) => {
            // console.log('set this.unviewedAchievements', achievements);
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

  get CompetitionName(): LeagueName {
    return LeagueName.Competition;
  }
  get CupName(): LeagueName {
    return LeagueName.Cup;
  }
  get SuperCupName(): LeagueName {
    return LeagueName.SuperCup;
  }

  get Competition(): NavBarItem {
    return NavBarItem.Competition;
  }
  get Cup(): NavBarItem {
    return NavBarItem.Cup;
  }
  get SuperCup(): NavBarItem {
    return NavBarItem.SuperCup;
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
  get Admin(): NavBarItem {
    return NavBarItem.Admin;
  }
  get PoolUsers(): NavBarItem {
    return NavBarItem.PoolUsers;
  }
  get Invite(): NavBarItem {
    return NavBarItem.Invite;
  }
  get Scouting(): NavBarItem {
    return NavBarItem.Scouting;
  }
  get MyTeam(): NavBarItem {
    return NavBarItem.MyTeam;
  }
  get Transfers(): NavBarItem {
    return NavBarItem.Transfers;
  }
  get ContextMenu(): NavBarItem {
    return NavBarItem.ContextMenu;
  }

  linkTo(navBarItem: NavBarItem): void {
    switch (navBarItem) {
      case NavBarItem.Competition:
        this.router.navigate(["/pool/competition", this.pool().getId()]);
        return;
      case NavBarItem.Cup:
        this.router.navigate(["/pool/cup", this.pool().getId()]);
        return;
      case NavBarItem.SuperCup:
        this.router.navigate(["/pool/poule-againstgames",this.pool().getId(), LeagueName.SuperCup, 0]);
        return;
      case NavBarItem.Schedule:
        this.linkToSchedule();
        return;
      case NavBarItem.Achievements:
        this.router.navigate(["/pool/achievements", this.pool().getId()]);
        return;
      case NavBarItem.Rules:
        this.router.navigate(["/pool/rules", this.pool().getId()]);
        return;
      case NavBarItem.PoolUsers:
        this.router.navigate(["/pool/users", this.pool().getId()]);
        return;
      case NavBarItem.Admin:
        this.router.navigate(["/pool/users", this.pool().getId()]);
        return;
      case NavBarItem.Invite:
        this.router.navigate(["/pool/invite", this.pool().getId()]);
        return;
      case NavBarItem.Scouting:
        this.router.navigate(["/pool/scouting/list", this.pool().getId()]);
        return;
      case NavBarItem.MyTeam:
        this.router.navigate(["/pool/formation/assemble", this.pool().getId()]);
        return;
      case NavBarItem.Transfers:
        this.router.navigate([
          "/pool/formation/replacements",
          this.pool().getId(),
        ]);
        return;
    }
  }

  linkToSchedule(): void {
    const competition = this.pool().getCompetition(LeagueName.Competition);
    if (competition === undefined) {
      return;
    }
    this.router.navigate(["/pool/allinonegame", this.pool().getId()]);
    // this.router.navigate(['/pool/poule-schedule', this.pool.getId(), LeagueName.Competition, 0]);
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

  getTrophyIconClass(item: NavBarItem): string {
    return this.current() !== item ? "text-success" : "text-silver";
  }
    
  getTextColorClass(item: NavBarItem): string {
    if (item === NavBarItem.Transfers) {
      return "btn-outline-warning";
    }
    return this.current() === item ? "btn-outline-success text-silver" : "btn-outline-success";
  }
}
