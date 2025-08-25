import { Component, OnInit, input, model } from '@angular/core';
import { Router } from '@angular/router';
import { Structure } from 'ngx-sport';

import { AuthService } from '../../../lib/auth/auth.service';
import { LeagueName } from '../../../lib/leagueName';
import { SuperElfNameService } from '../../../lib/nameservice';
import { Pool } from '../../../lib/pool';
import { PoolUser } from '../../../lib/pool/user';
import { CompetitionsNavBarItem } from './items';
import { SuperElfTrophyIconComponent } from '../icon/trophy.component';
import { GameRoundRepository } from '../../../lib/gameRound/repository';
import { GameRound } from '../../../lib/gameRound';
import { forkJoin } from 'rxjs';

@Component({
  standalone: true,
  imports: [SuperElfTrophyIconComponent],
  selector: "app-competitions-navbar",
  templateUrl: "./competitionsNavBar.component.html",
  styleUrls: ["./competitionsNavBar.component.scss"],
})
export class PoolCompetitionsNavBarComponent implements OnInit {
  readonly pool = input.required<Pool>();
  readonly poolUser = input<PoolUser>();
  readonly current = input<CompetitionsNavBarItem>();
  readonly superCupActive = model<boolean>(false);
  readonly cupActive = model<boolean>(false);
  readonly currentGameRound = input<GameRound>();

  public hasSuperCup = true;
  public hasWorldCup = false;

  public structureMap = new Map<number, Structure>();

  constructor(
    public authService: AuthService,
    private router: Router,
    public nameService: SuperElfNameService,
    public gameRoundRepository: GameRoundRepository
  ) {
    // als  CompetitionsNavBarItem ongelijk aan cup
    // kijk als cup actief is met activeGameRound
    // en toon dan evt een blauwe bal!!
  }

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

  get Competition(): LeagueName {
    return LeagueName.Competition;
  }
  get Cup(): LeagueName {
    return LeagueName.Cup;
  }
  get SuperCup(): LeagueName {
    return LeagueName.SuperCup;
  }
  get WorldCup(): LeagueName {
    return LeagueName.WorldCup;
  }

  get PouleRankingTogetherSport(): CompetitionsNavBarItem {
    return CompetitionsNavBarItem.PouleRankingTogetherSport;
  }
  get CupStructure(): CompetitionsNavBarItem {
    return CompetitionsNavBarItem.CupStructure;
  }
  get SuperCupGame(): CompetitionsNavBarItem {
    return CompetitionsNavBarItem.SuperCupGame;
  }
  get WorldCupStructure(): CompetitionsNavBarItem {
    return CompetitionsNavBarItem.WorldCupStructure;
  }

  getTextColorClass(item: CompetitionsNavBarItem): string {
    return this.current() !== item ? "text-success" : "text-white";
  }

  linkTo(navBarItem: CompetitionsNavBarItem): void {
    switch (navBarItem) {
      case CompetitionsNavBarItem.PouleRankingTogetherSport:
        this.router.navigate(["/pool/competition", this.pool().getId()]);
        return;
      case CompetitionsNavBarItem.CupStructure:
        this.router.navigate(["/pool/cup", this.pool().getId()]);
        return;
      case CompetitionsNavBarItem.SuperCupGame:
        this.router.navigate([
          "/pool/poule-againstgames",
          this.pool().getId(),
          LeagueName.SuperCup,
          0,
        ]);
        return;
      case CompetitionsNavBarItem.WorldCupStructure:
        this.router.navigate([
          "/pool/worldcup",
          this.pool().getSeason().getId(),
          this.pool().getId(),
        ]);
        return;
    }
  }
}
