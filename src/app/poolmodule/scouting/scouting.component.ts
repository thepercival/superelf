import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolCollection } from '../../lib/pool/collection';
import { PoolComponent } from '../../shared/poolmodule/component';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { ScoutedPerson } from '../../lib/scoutedPerson';
import { Pool } from '../../lib/pool';
import { Competition, Person, PersonMap, Player } from 'ngx-sport';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveApprovalModalComponent } from '../removeapproval/removeapprovalmodal.component';
import { ScoutedPersonMapper } from '../../lib/scoutedPerson/mapper';
import { ConfirmPersonChoiceModalComponent } from '../choosepersons/confirmpersonchoicemodal.component';


@Component({
  selector: 'app-pool-scouting',
  templateUrl: './scouting.component.html',
  styleUrls: ['./scouting.component.scss']
})
export class ScoutingComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  scoutingList: ScoutingList = { scoutedPersons: [], mappedPersons: new PersonMap() };
  showSearchBtn = false;
  showSearchOnSM: boolean = false;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected scoutedPersonRepository: ScoutedPersonRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      url: [{ value: '', disabled: true }, Validators.compose([
      ])],
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      this.showSearchBtn = !pool.isInAssembleOrTransferPeriod();
      console.log(pool.isInAssembleOrTransferPeriod());
      this.initScoutedPersons(pool);
    });
  }

  initScoutedPersons(pool: Pool) {
    this.scoutedPersonRepository.getObjects(pool.getSourceCompetition())
      .subscribe(
          /* happy path */(scoutedPersons: ScoutedPerson[]) => {
          scoutedPersons.forEach(scoutedPerson => this.addToScoutingList(scoutedPerson))
        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );
  }

  protected addToScoutingList(scoutedPerson: ScoutedPerson) {
    this.scoutingList.scoutedPersons.push(scoutedPerson);
    this.scoutingList.mappedPersons.set(+scoutedPerson.getPerson().getId(), scoutedPerson.getPerson());

  }

  protected removeFromToScoutingList(scoutedPerson: ScoutedPerson) {
    this.scoutingList.scoutedPersons.splice(this.scoutingList.scoutedPersons.indexOf(scoutedPerson), 1);
    this.scoutingList.mappedPersons.delete(+scoutedPerson.getPerson().getId());
  }

  openRemoveApprovalModal(scoutedPerson: ScoutedPerson, pool: Pool) {
    const modalRef = this.modalService.open(RemoveApprovalModalComponent);
    modalRef.componentInstance.entittyName = 'gescoute speler';
    modalRef.componentInstance.name = scoutedPerson.getPerson().getName();
    modalRef.result.then((result) => {
      this.remove(scoutedPerson, pool.getSourceCompetition());
    }, (reason) => {
    });
  }

  remove(scoutedPerson: ScoutedPerson, sourceCompetition: Competition) {
    this.processing = true;
    this.scoutedPersonRepository.removeObject(scoutedPerson, sourceCompetition)
      .subscribe(
            /* happy path */() => {
          this.removeFromToScoutingList(scoutedPerson);
          this.setAlert('success', '"' + scoutedPerson.getPerson().getName() + '" verwijderd');
        },
            /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
            /* on complete */() => this.processing = false
      );
  }

  add(player: Player) {
    if (!this.pool) {
      return;
    }
    this.processing = true;
    this.scoutedPersonRepository.createObject(player.getPerson(), this.pool.getSourceCompetition())
      .subscribe(
          /* happy path */(scoutedPerson: ScoutedPerson) => {
          // this.scoutingList.mappedPersons = new PersonMap();
          this.addToScoutingList(scoutedPerson);

          if (this.showSearchOnSM) {
            this.openConfirmModal(scoutedPerson.getPerson());
          }
        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );

  }

  openConfirmModal(person: Person) {
    const modalRef = this.modalService.open(ConfirmPersonChoiceModalComponent);
    modalRef.componentInstance.person = person;
    modalRef.result.then((result) => {
      if (result === 'goback') {
        this.showSearchOnSM = false;
      }
    }, (reason) => {
    });
  }

  copyToTeam(person: Person) {

  }
}

interface ScoutingList {
  scoutedPersons: ScoutedPerson[];
  mappedPersons: PersonMap;
}
