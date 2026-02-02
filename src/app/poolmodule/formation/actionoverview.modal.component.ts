import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { FootballLine, Formation, NameService, Player } from 'ngx-sport';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { Replacement } from '../../lib/editAction/replacement';
import { Transfer } from '../../lib/editAction/transfer';
import { Substitution } from '../../lib/editAction/substitution';
import { S11FormationCalculator } from '../../lib/formation/calculator';
import { S11Formation } from '../../lib/formation';
import { TransferPeriodActionList } from '../../lib/editAction';
import { FormationRepository } from '../../lib/formation/repository';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamNameComponent } from '../team/name.component';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { faChevronLeft, faChevronRight, faRightLeft, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import { IAlert } from '../../shared/commonmodule/alert';

@Component({
  selector: "app-pool-actionoverview-modal",
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbAlertModule,
    TeamNameComponent,
    LineIconComponent,
  ],
  templateUrl: "./actionoverview.modal.component.html",
  styleUrls: ["./actionoverview.modal.component.scss"],
})
export class FormationActionOverviewModalComponent implements OnInit {
  public poolUser!: PoolUser;

  public alert: IAlert | undefined;
  public processing: WritableSignal<boolean> = signal(true);

  list!: TransferPeriodActionList;
  nameService = new NameService();
  replacements: Replacement[] | undefined;
  transfers: Transfer[] | undefined;
  substitutions: Substitution[] | undefined;
  public calcFormation: S11Formation | undefined;
  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;
  public faRightLeft = faRightLeft;
  public faUsers = faUsers;
  public faUserCircle = faUserCircle;

  constructor(
    public modal: NgbActiveModal,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository
  ) {    
  }

  ngOnInit() {
    this.list = this.poolUser.getTransferPeriodActionList();
    this.formationRepository
      .getObject(this.poolUser, this.poolUser.getPool().getAssembleViewPeriod())
      .subscribe({
        next: (assembleFormation: S11Formation) => {
          const calculator = new S11FormationCalculator();
          this.calcFormation = calculator.getCurrentFormation(
            assembleFormation,
            this.list
          );
        },
        error: (e: string) => {
          this.alert = { type: "danger", message: e };          
          this.processing.set(false);
        },
        complete: () => {
          this.processing.set(false)
        },
      });
  }

  getPlayerIn(calcFormation: S11Formation, substitution: Substitution): Player {
    return this.getPlayer(calcFormation, substitution.getLineNumberOut());
  }

  getPlayerOut(
    calcFormation: S11Formation,
    substitution: Substitution
  ): Player {
    return this.getPlayer(
      calcFormation,
      substitution.getLineNumberOut(),
      substitution.getPlaceNumberOut()
    );
  }

  private getPlayer(
    calcFormation: S11Formation,
    lineNumber: FootballLine,
    placeNumber?: number | undefined
  ): Player {
    const formationLine = calcFormation.getLine(lineNumber);
    let place = formationLine.getSubstitute();
    if (placeNumber !== undefined) {
      place = formationLine.getPlace(placeNumber);
    }
    const player = place.getPlayer()?.getMostRecentPlayer();
    if (player === undefined) {
      throw new Error("no player found");
    }
    return player;
  }

  inTransfer(pool: Pool): boolean {
    return pool.getTransferPeriod().isIn();
  }

  inAfterTransfer(pool: Pool): boolean {
    return (
      pool.getTransferPeriod().getEndDateTime().getTime() < new Date().getTime()
    );
  }
}