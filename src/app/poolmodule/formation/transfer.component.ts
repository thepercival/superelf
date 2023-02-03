import { Component, OnInit, TemplateRef } from '@angular/core';
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
import { FootballFormationChecker } from '../../lib/formation/footballChecker';
import { S11FormationCalculator } from '../../lib/formation/calculator';
import { EditActionMapper } from '../../lib/editAction/mapper';
import { JsonTransfer } from '../../lib/editAction/transfer/json';
import { Transfer } from '../../lib/editAction/transfer';
import { forkJoin, Observable } from 'rxjs';
import { TransferPeriod } from '../../lib/period/transfer';

@Component({
  selector: 'app-pool-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class FormationTransferComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  nameService = new NameService();
  teamPersonMap = new PersonMap();
  selectedPlace: S11FormationPlace | undefined;
  selectedSearchLine: FootballLine | undefined;
  selectedTeamMap: TeamMap = new TeamMap();
  public transferPeriod!: TransferPeriod;
  public calcFormation: S11Formation|undefined;
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public transferEditMode = TransferEditMode.Single;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected transferPeriodActionMapper: EditActionMapper,
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
          this.transferPeriod = this.pool.getCompetitionConfig().getTransferPeriod();
          this.poolUserRepository.getObjectFromSession(pool).subscribe({
            next: ((poolUser: PoolUser) => {
              this.poolUser = poolUser;
              const calculator = new S11FormationCalculator();
              this.calcFormation = calculator.getCurrentFormation(poolUser);
            }),
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

  toggleTransferEditMode(): void {
    this.transferEditMode = this.transferEditMode === TransferEditMode.Single ? TransferEditMode.Double : TransferEditMode.Single;
  }
  
  get SingleEditMode(): TransferEditMode { return TransferEditMode.Single; }
  get DoubleEditMode(): TransferEditMode { return TransferEditMode.Double; }

  hasPlayersWithoutCurrentTeam(poolUser: PoolUser): boolean {
    const assembleFormation = poolUser.getAssembleFormation();
    if( assembleFormation === undefined) {
      throw new Error('assemblePeriod cannot be empty');
    }
    const transferPeriodStart = this.pool.getCompetitionConfig().getTransferPeriod().getStartDateTime();
    return assembleFormation.getPlacesWithoutTeam(transferPeriodStart).length > 0;
  }

  linkToTransfer(place: S11FormationPlace) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        line: place.getFormationLine().getNumber(),
        teamId: this.getTeamId(place)
      }
    };
    this.router.navigate(['/pool/formation/place/transfer/', this.pool.getId(), place.getLine(), place.getNumber()], navigationExtras);
  }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToPlayer(s11Player: S11Player): void {
    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), 0]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }

  linkToReplace(poolUser: PoolUser, modalContent: TemplateRef<any>): void {
    // als al transfers dan vragen om transfers te verwijderen.
    if( poolUser.getTransfers().length === 0 ) {
      this.router.navigate(['/pool/formation/replacements', this.pool.getId()]);        
    } else {
      this.openRemoveModal(modalContent);
    }    
  }

  openRemoveModal(modalContent: TemplateRef<any>) {    

    const modalRef = this.modalService.open(modalContent);
    modalRef.result.then((poolUser: PoolUser) => {
      this.removeTransfers(poolUser);
    });
  }

  removeTransfers(poolUser: PoolUser) {
    this.processing = true;   
    const removeTransferRequests: Observable<void>[] = poolUser.getTransfers().map((transfer: Transfer): Observable<void> => {
      return this.formationRepository.removeTransfer(transfer, poolUser);
    });


    forkJoin(removeTransferRequests).subscribe({
      next: () => {
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
}

export enum TransferEditMode {
  Single = 1,
  Double
}