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
import { S11FormationCalculator } from '../../lib/formation/calculator';
import { EditActionMapper } from '../../lib/editAction/mapper';
import { Transfer } from '../../lib/editAction/transfer';
import { forkJoin, Observable } from 'rxjs';
import { TransferPeriod } from '../../lib/period/transfer';
import { S11FormationLine } from '../../lib/formation/line';

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
  public assembleFormation: S11Formation|undefined;
  public transferPeriod!: TransferPeriod;
  public calcFormation: S11Formation|undefined;
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public transferEditMode = TransferEditMode.Single;
  public goalKeeperPlace: S11FormationPlace|undefined;

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
              this.formationRepository.getObject(poolUser, pool.getAssembleViewPeriod()).subscribe({
                  next: (assembleFormation: S11Formation) => {
                    this.assembleFormation = assembleFormation;
                    const calculator = new S11FormationCalculator();
                    if( this.hasNoNextEditAction(poolUser) ) {
                      this.router.navigate(['/pool/formation/substitutions/', this.pool.getId()]);
                    } else if( !calculator.areAllPlacesWithoutTeamReplaced(assembleFormation, poolUser.getTransferPeriodActionList().replacements) ) {
                      this.setAlert('danger', 'er zijn nog spelers zonder team');
                    } else {
                      this.calcFormation = calculator.getCurrentFormation(assembleFormation, poolUser.getTransferPeriodActionList());
                    }
                    this.processing = false;
                  },
                  error: (e) => {
                    this.setAlert('danger', e); this.processing = false;
                  }
                });              
            }),
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
    return poolUser.getTransferPeriodActionList().substitutions.length > 0
  }

  toggleTransferEditMode(modalContent: TemplateRef<any>): void {
    if( this.transferEditMode === TransferEditMode.Single) {
      // this.transferEditMode = TransferEditMode.Double;
      this.openInfoModal(modalContent);
      return;
    }
    // this.transferEditMode = this.transferEditMode === TransferEditMode.Single ? TransferEditMode.Double : TransferEditMode.Single;
    // this.transferEditMode = TransferEditMode.Single;
  }

  openInfoModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent);    
  }
  
  get SingleEditMode(): TransferEditMode { return TransferEditMode.Single; }
  get DoubleEditMode(): TransferEditMode { return TransferEditMode.Double; }

  public hasPlayersWithoutCurrentTeam(assembleFormation: S11Formation): boolean {
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

  linkToSubstitutions(): void {
    this.router.navigate(['/pool/formation/substitutions', this.pool.getId()]);
  }

  linkToPlayer(s11Player: S11Player): void {
    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), 0]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }

  linkToReplacements(poolUser: PoolUser, assembleFormation: S11Formation, modalContent: TemplateRef<any>): void {
    // als al transfers dan vragen om transfers te verwijderen.
    if( poolUser.getTransferPeriodActionList().transfers.length === 0 ) {
      this.router.navigate(['/pool/formation/replacements', this.pool.getId()]);        
    } else {
      this.openRemoveModal(assembleFormation, modalContent);
    }    
  }

  canRemoveTransfer(calcFormation: S11Formation, line: S11FormationLine): boolean {
    return false;
  }

  openRemoveModal(assembleFormation: S11Formation, modalContent: TemplateRef<any>) {
    const modalRef = this.modalService.open(modalContent);
    modalRef.result.then((poolUser: PoolUser) => {
      this.remove(assembleFormation, poolUser.getTransferPeriodActionList().transfers, true);
    });
  }

  remove(assembleFormation: S11Formation, transfers: Transfer[], linkToReplacements: boolean) {
    this.processing = true;   
    const removeTransferRequests: Observable<void>[] = transfers.map((transfer: Transfer): Observable<void> => {
      return this.formationRepository.removeTransfer(transfer, transfer.getPoolUser());
    });

    forkJoin(removeTransferRequests).subscribe({
      next: () => {
        if( linkToReplacements ) {
          this.router.navigate(['/pool/formation/replacements', this.pool.getId()]);        
        }
        const calculator = new S11FormationCalculator();
        this.calcFormation = calculator.getCurrentFormation(assembleFormation, this.poolUser.getTransferPeriodActionList());
        this.processing = false;
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