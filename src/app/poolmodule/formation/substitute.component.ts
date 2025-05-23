import { Component, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, PersonMap, TeamMap, FootballLine } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
import { S11Player } from '../../lib/player';
import { S11FormationPlace } from '../../lib/formation/place';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { S11Formation } from '../../lib/formation';
import { S11FormationCalculator } from '../../lib/formation/calculator';
import { EditActionMapper } from '../../lib/editAction/mapper';
import { forkJoin, Observable } from 'rxjs';
import { TransferPeriod } from '../../lib/periods/transferPeriod';
import { Substitution } from '../../lib/editAction/substitution';
import { JsonSubstitution } from '../../lib/editAction/substitution/json';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { FormationLineSubstitutionsComponent } from './line/substitutions.component';
import { faChevronLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-pool-substitute",
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbAlertModule,
    PoolNavBarComponent,
    FormationLineSubstitutionsComponent,
  ],
  templateUrl: "./substitute.component.html",
  styleUrls: ["./substitute.component.scss"],
})
export class FormationSubstituteComponent
  extends PoolComponent
  implements OnInit
{
  poolUser!: PoolUser;
  nameService = new NameService();
  teamPersonMap = new PersonMap();
  selectedPlace: S11FormationPlace | undefined;
  selectedSearchLine: FootballLine | undefined;
  selectedTeamMap: TeamMap = new TeamMap();
  public transferPeriod!: TransferPeriod;
  public assembleFormation: S11Formation | undefined;
  public calcFormation: S11Formation | undefined;
  public faInfoCircle = faInfoCircle;
  public faChevronLeft = faChevronLeft;

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
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        this.transferPeriod = pool.getCompetitionConfig().getTransferPeriod();
        this.poolUserRepository.getObjectFromSession(pool).subscribe({
          next: (poolUser: PoolUser) => {
            this.poolUser = poolUser;
            this.formationRepository
              .getObject(poolUser, pool.getAssembleViewPeriod())
              .subscribe({
                next: (assembleFormation: S11Formation) => {
                  this.assembleFormation = assembleFormation;
                  const calculator = new S11FormationCalculator();
                  if (
                    !calculator.areAllPlacesWithoutTeamReplaced(
                      assembleFormation,
                      poolUser.getTransferPeriodActionList().replacements
                    )
                  ) {
                    this.setAlert("danger", "er zijn nog spelers zonder team");
                  } else {
                    this.calcFormation = calculator.getCurrentFormation(
                      assembleFormation,
                      poolUser.getTransferPeriodActionList()
                    );
                  }
                },
                error: (e) => {
                  this.setAlert("danger", e);
                  this.processing.set(false);
                },
              });
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing.set(false);
          },
          complete: () => this.processing.set(false),
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  linkToTransfer(pool: Pool, place: S11FormationPlace) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        line: place.getFormationLine().getNumber(),
        teamId: this.getTeamId(place),
      },
    };
    this.router.navigate(
      [
        "/pool/formation/place/transfer/",
        pool.getId(),
        place.getLine(),
        place.getNumber(),
      ],
      navigationExtras
    );
  }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToPlayer(pool: Pool, s11Player: S11Player): void {
    if (s11Player.getId() === 0) {
      return;
    }
    this.router.navigate(
      ["/pool/player/", pool.getId(), s11Player.getId(), 0] /*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/
    );
  }

  linkToTransfers(
    poolUser: PoolUser,
    assembleFormation: S11Formation,
    modalContent: TemplateRef<any>
  ): void {
    if (poolUser.getTransferPeriodActionList().substitutions.length === 0) {
      this.router.navigate([
        "/pool/formation/transfers",
        poolUser.getPool().getId(),
      ]);
    } else {
      this.openRemoveModal(poolUser.getPool(), assembleFormation, modalContent);
    }
  }

  openRemoveModal(
    pool: Pool,
    assembleFormation: S11Formation,
    modalContent: TemplateRef<any>
  ) {
    const modalRef = this.modalService.open(modalContent);
    modalRef.result.then((poolUser: PoolUser) => {
      this.remove(
        pool,
        assembleFormation,
        poolUser.getTransferPeriodActionList().substitutions,
        true
      );
    });
  }

  substitute(assembleFormation: S11Formation, placeOut: S11FormationPlace) {
    this.processing.set(true);
    const jsonSubstitution: JsonSubstitution = {
      id: 0,
      lineNumberOut: placeOut.getLine(),
      placeNumberOut: placeOut.getNumber(),
      createdDate: new Date().toISOString(),
    };
    this.formationRepository
      .substitute(jsonSubstitution, this.poolUser)
      .subscribe({
        next: () => {
          const calculator = new S11FormationCalculator();
          this.calcFormation = calculator.getCurrentFormation(
            assembleFormation,
            this.poolUser.getTransferPeriodActionList()
          );
          this.processing.set(false);
        },
        error: (e: string) => {
          this.setAlert("danger", e);
          this.processing.set(false);
        },
        complete: () => this.processing.set(false),
      });
  }

  remove(
    pool: Pool,
    assembleFormation: S11Formation,
    substitutions: Substitution[],
    linkToTransfers: boolean
  ) {
    this.processing.set(true);
    const removeSubstitutionRequests: Observable<void>[] = substitutions.map(
      (substitution: Substitution): Observable<void> => {
        return this.formationRepository.removeSubstitution(
          substitution,
          substitution.getPoolUser()
        );
      }
    );

    forkJoin(removeSubstitutionRequests).subscribe({
      next: () => {
        if (linkToTransfers) {
          this.router.navigate(["/pool/formation/transfers", pool.getId()]);
        }
        const calculator = new S11FormationCalculator();
        this.calcFormation = calculator.getCurrentFormation(
          assembleFormation,
          this.poolUser.getTransferPeriodActionList()
        );
        this.processing.set(false);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}