import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, Player } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { ScoutedPerson } from '../../lib/scoutedPerson';
import { Pool } from '../../lib/pool';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { ActiveConfig } from '../../lib/pool/activeConfig';
import { JsonFormationShell } from '../../lib/activeConfig/json';


@Component({
  selector: 'app-pool-assembleteam',
  templateUrl: './assemble.component.html',
  styleUrls: ['./assemble.component.scss']
})
export class AssembleComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  availableFormations: JsonFormationShell[] = [];
  nameService = new NameService();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected playerRepository: PlayerRepository,
    protected scoutedPersonRepository: ScoutedPersonRepository,
    protected activeConfigRepository: ActiveConfigRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      availableFormations: [undefined]
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;

      // hier een concat map doen om assembleFormation op te halen
      // en daarna activeConfigRepo, kan dus door bv. pooluser op te halen

      this.activeConfigRepository.getObject()
        .subscribe(
        /* happy path */(config: ActiveConfig) => {
            this.availableFormations = config.getAvailableFormations();
          },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
        );


      this.form.controls.searchTeam.setValue(undefined);

      // this.setScountingList(pool);
      // this.searchPersons(pool);
    });
  }

  // searchPersons(pool: Pool) {
  //   const sourceCompetition = pool.getSourceCompetition();
  //   const lineFilter = this.form.controls.searchLine.value;
  //   const teamFilter = this.form.controls.searchTeam.value;
  //   this.playerRepository.getObjects(sourceCompetition, teamFilter, lineFilter).subscribe((players: Player[]) => {
  //     this.foundPlayers = players;
  //   },
  //     /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
  //     /* onComplete */() => { this.processing = false });
  // }

  // setScountingList(pool: Pool) {
  //   const sourceCompetition = pool.getSourceCompetition();
  //   this.scoutedPersonRepository.getObjects(sourceCompetition).subscribe((scoutedPersons: ScoutedPerson[]) => {
  //     this.scoutedPersons = scoutedPersons;
  //   },
  //     /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
  //   );
  // }

  // searchPersonsAndGetScountingList(pool: Pool) {
  //   const sourceCompetition = pool.getSourceCompetition();
  //   const async = [
  //     this.playerRepository.getObjects(sourceCompetition, this.teamFilter, this.lineFilter),
  //     this.scoutedPersonRepository.getObjects(sourceCompetition)
  //   ];
  //   forkJoin(async).subscribe(responseList => {
  //     this.foundPlayers = <Player[]>responseList[0];
  //     this.scoutedPersons = <ScoutedPerson[]>responseList[1];
  //   },
  //     /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
  //     /* onComplete */() => { this.processing = false });
  // }

  // addToScoutingList(person: Person, pool: Pool) {
  //   this.processing = true;
  //   this.scoutedPersonRepository.createObject(person, pool.getSourceCompetition())
  //     .subscribe(
  //         /* happy path */(scoutedPerson: ScoutedPerson) => {
  //         this.scoutedPersons.push(scoutedPerson);
  //         this.openConfirmModal(scoutedPerson.getPerson());
  //       },
  //       /* error path */(e: string) => {
  //         this.setAlert('danger', e); this.processing = false;
  //       },
  //       /* onComplete */() => { this.processing = false }
  //     );

  // }

  // openConfirmModal(person: Person) {
  //   const modalRef = this.modalService.open(ConfirmPersonChoiceModalComponent);
  //   console.log(person);
  //   modalRef.componentInstance.person = person;
  //   modalRef.result.then((result) => {
  //     if (result === 'toscouting')
  //       this.router.navigate(['/pool/scouting', this.pool?.getId()]);
  //   }, (reason) => {
  //   });
  // }

  // inScoutingList(person: Person): boolean {
  //   return this.scoutedPersons.some(scoutedPerson => scoutedPerson.getPerson() === person);
  // }
}
