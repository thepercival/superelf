import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { FormationLineDef, NameService, Person, Player, Team } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { ConfirmPersonChoiceModalComponent } from './confirmpersonchoicemodal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { forkJoin, Observable } from 'rxjs';
import { ScoutedPerson } from '../../lib/scoutedPerson';
import { Pool } from '../../lib/pool';
import { TeamCompetitor } from 'ngx-sport/src/competitor/team';


@Component({
  selector: 'app-pool-choosepersons',
  templateUrl: './choosepersons.component.html',
  styleUrls: ['./choosepersons.component.scss']
})
export class ChoosePersonsComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  foundPlayers: Player[] | undefined;
  searchTeams: Team[] = [];
  searchLines: number[] = [];
  scoutedPersons: ScoutedPerson[] = [];
  nameService = new NameService();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected playerRepository: PlayerRepository,
    protected scoutedPersonRepository: ScoutedPersonRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      searchTeam: [undefined],
      searchLine: [FormationLineDef.All],
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      console.log(pool.getSourceCompetition().getTeamCompetitors());
      this.form.controls.searchTeam.setValue(undefined);
      this.searchTeams = pool.getSourceCompetition().getTeamCompetitors().map((teamCompetitor: TeamCompetitor) => teamCompetitor.getTeam());

      this.searchLines.push(FormationLineDef.All);
      for (let line = 1; line < FormationLineDef.All; line *= 2) {
        this.searchLines.push(line);
      }

      this.setScountingList(pool);
      this.searchPersons(pool);
    });
  }

  searchPersons(pool: Pool) {
    const sourceCompetition = pool.getSourceCompetition();
    const lineFilter = this.form.controls.searchLine.value;
    const teamFilter = this.form.controls.searchTeam.value;
    this.playerRepository.getObjects(sourceCompetition, teamFilter, lineFilter).subscribe((players: Player[]) => {
      this.foundPlayers = players;
    },
      /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
      /* onComplete */() => { this.processing = false });
  }

  setScountingList(pool: Pool) {
    const sourceCompetition = pool.getSourceCompetition();
    this.scoutedPersonRepository.getObjects(sourceCompetition).subscribe((scoutedPersons: ScoutedPerson[]) => {
      this.scoutedPersons = scoutedPersons;
    },
      /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
    );
  }

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

  addToScoutingList(person: Person, pool: Pool) {
    this.processing = true;
    this.scoutedPersonRepository.createObject(person, pool.getSourceCompetition())
      .subscribe(
          /* happy path */(scoutedPerson: ScoutedPerson) => {
          this.scoutedPersons.push(scoutedPerson);
          this.openConfirmModal(scoutedPerson.getPerson());
        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );

  }

  openConfirmModal(person: Person) {
    const modalRef = this.modalService.open(ConfirmPersonChoiceModalComponent);
    console.log(person);
    modalRef.componentInstance.person = person;
    modalRef.result.then((result) => {
      if (result === 'toscouting')
        this.router.navigate(['/pool/scouting', this.pool?.getId()]);
    }, (reason) => {
    });
  }

  inScoutingList(person: Person): boolean {
    return this.scoutedPersons.some(scoutedPerson => scoutedPerson.getPerson() === person);
  }
}
