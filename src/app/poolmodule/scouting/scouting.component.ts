import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolCollection } from '../../lib/pool/collection';
import { PoolComponent } from '../../shared/poolmodule/component';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { ScoutedPerson } from '../../lib/scoutedPerson';
import { Pool } from '../../lib/pool';
import { Competition, Person } from 'ngx-sport';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveApprovalModalComponent } from '../removeapproval/removeapprovalmodal.component';


@Component({
  selector: 'app-pool-scouting',
  templateUrl: './scouting.component.html',
  styleUrls: ['./scouting.component.scss']
})
export class ScoutingComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  scoutedPersons: ScoutedPerson[] = [];
  enableSearch: boolean = false;

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
      this.enableSearch = pool.assemblePeriodNotStarted();
      this.initScoutedPersons(pool);
    });
  }

  initScoutedPersons(pool: Pool) {
    this.scoutedPersonRepository.getObjects(pool.getSourceCompetition())
      .subscribe(
          /* happy path */(scoutedPersons: ScoutedPerson[]) => {
          this.scoutedPersons = scoutedPersons;

        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );
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
          this.scoutedPersons.splice(this.scoutedPersons.indexOf(scoutedPerson), 1);
          this.setAlert('success', '"' + scoutedPerson.getPerson().getName() + '" verwijderd');
        },
            /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
            /* on complete */() => this.processing = false
      );
  }

  copyToTeam(person: Person) {

  }
}
