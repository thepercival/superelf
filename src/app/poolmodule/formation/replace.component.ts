import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
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
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { S11Formation } from '../../lib/formation';
import { S11FormationCalculator } from '../../lib/formation/calculator';
import { Replacement } from '../../lib/editAction/replacement';

@Component({
  selector: 'app-pool-replace',
  templateUrl: './replace.component.html',
  styleUrls: ['./replace.component.scss']
})
export class FormationReplaceComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  nameService = new NameService();
  teamPersonMap = new PersonMap();
  selectedPlace: S11FormationPlace | undefined;
  selectedSearchLine: FootballLine | undefined;
  selectedTeamMap: TeamMap = new TeamMap();
  public calcFormation: S11Formation|undefined;
  public assembleFormation: S11Formation|undefined;
  public calculator = new S11FormationCalculator();
  public oneTeamSimultaneous = new OneTeamSimultaneous();


  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected playerRepository: PlayerRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository,
    fb: UntypedFormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit()
      .subscribe({
        next: (pool: Pool) => {
          this.setPool(pool);
          this.poolUserRepository.getObjectFromSession(pool).subscribe({
            next: (poolUser: PoolUser) => {
              this.poolUser = poolUser;
              if( this.hasNoNextEditAction(poolUser) ) {
                this.router.navigate(['/pool/formation/substitutions/', this.pool.getId()]);
              } else {
                this.formationRepository.getObject(poolUser, pool.getAssembleViewPeriod()).subscribe({
                  next: (assembleFormation: S11Formation) => {                    
                    const calculator = new S11FormationCalculator();
                    this.assembleFormation = assembleFormation;
                    this.calcFormation = calculator.getCurrentFormation(assembleFormation, poolUser.getTransferPeriodActionList());
                  },
                  error: (e: string) => {
                    this.setAlert('danger', e); this.processing = false;
                  },
                  complete: () => this.processing = false
                });
              }
            },
            error: (e: string) => {
              this.setAlert('danger', e); this.processing = false;
            }
          });
        },
        error: (e) => {
          this.setAlert('danger', e); this.processing = false;
        }
      });
  }

  hasNoNextEditAction(poolUser: PoolUser): boolean {
    return poolUser.getTransferPeriodActionList().transfers.length > 0 || poolUser.getTransferPeriodActionList().substitutions.length > 0
  }

  linkToReplace(assembleFormation: S11Formation, place: S11FormationPlace) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        line: place.getFormationLine().getNumber(),
        teamId: this.getTeamId(place)
      }
    };
    const placeId = assembleFormation.getPlace(place.getLine(), place.getNumber()).getId();
    this.router.navigate(['/pool/formation/place/replace/', this.pool.getId(), placeId], navigationExtras);
  }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToTransfers(): void {
    this.router.navigate(['/pool/formation/transfers', this.pool.getId()]);
  }

  linkToPlayer(s11Player: S11Player): void {
    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), 0]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }
  
  remove(assembleFormation: S11Formation, replacement: Replacement) {
    this.processing = true;   
    this.formationRepository.removeReplacement(replacement, replacement.getPoolUser()).subscribe({
      next: () => {
        const calculator = new S11FormationCalculator();
        this.calcFormation = calculator.getCurrentFormation(assembleFormation, replacement.getPoolUser().getTransferPeriodActionList());
        this.processing = false;   
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
}