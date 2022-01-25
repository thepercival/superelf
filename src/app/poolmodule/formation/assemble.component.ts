import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, PersonMap, TeamMap, FootballLine } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
import { S11Player } from '../../lib/player';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11FormationPlace } from '../../lib/formation/place';

@Component({
  selector: 'app-pool-assemble',
  templateUrl: './assemble.component.html',
  styleUrls: ['./assemble.component.scss']
})
export class FormationAssembleComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  nameService = new NameService();
  teamPersonMap = new PersonMap();
  selectedPlace: S11FormationPlace | undefined;
  selectedSearchLine: number = FootballLine.All;
  selectedTeamMap: TeamMap = new TeamMap();
  public oneTeamSimultaneous = new OneTeamSimultaneous();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected playerRepository: PlayerRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);
  }

  ngOnInit() {
    super.parentNgOnInit()
      .subscribe({
        next: (pool: Pool) => {
          this.pool = pool;
          this.poolUserRepository.getObjectFromSession(pool).subscribe({
            next: (poolUser: PoolUser) => this.poolUser = poolUser,
            error: (e: string) => {
              this.setAlert('danger', e); this.processing = false;
            },
            complete: () => this.processing = false
          });
        },
        error: (e) => {
          this.setAlert('danger', e); this.processing = false;
        }
      });
  }

  getFormationName(): string {
    return this.poolUser?.getAssembleFormation()?.getName() ?? 'kies formatie';
  }

  editPlace(place: S11FormationPlace) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        line: place.getFormationLine().getNumber(),
        teamId: this.getTeamId(place)
      }
    };
    this.router.navigate(['/pool/formation/place/edit/', this.pool.getId(), place.getId()], navigationExtras);
  }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToPlayer(s11Player: S11Player): void {
    this.router.navigate(['/pool/player/', this.pool.getId()], {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    });
  }
}
