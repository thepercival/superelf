import { Component, Input, OnInit, TemplateRef } from '@angular/core';
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
export class PoolCompetitionsNavBarComponent implements OnInit{
  @Input() pool!: Pool;
  @Input() poolUser: PoolUser|undefined;
  @Input() current: CompetitionsNavBarItem|undefined;

  public hasSuperCup = true;
  public hasWorldCup = false;

  public structureMap = new Map<number, Structure>();

  constructor(
    public authService: AuthService,
    private router: Router,
    public nameService: SuperElfNameService,
  ) {

  }

  ngOnInit(){
    this.hasSuperCup = this.pool.getCompetition(LeagueName.SuperCup) !== undefined;
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
    return this.current !== item ? 'text-success' : 'text-white';
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
        this.router.navigate(['/pool/worldcup', this.pool.getSeason().getId(), this.pool.getId()]);
        return;
    }
  }
}
