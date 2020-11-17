import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, Person, Player } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { Pool } from '../../lib/pool';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { ActiveConfig } from '../../lib/pool/activeConfig';
import { JsonFormationShell } from '../../lib/activeConfig/json';
import { concatMap, pairwise } from 'rxjs/operators';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { Formation } from '../../lib/formation';
import { FormationLineMapper } from '../../lib/formation/line/mapper';
import { FormationLine } from '../../lib/formation/line';
import { SuperElfNameService } from '../../lib/nameservice';
import { FormationRepository } from '../../lib/formation/repository';


@Component({
  selector: 'app-pool-assembleteam',
  templateUrl: './assemble.component.html',
  styleUrls: ['./assemble.component.scss']
})
export class AssembleComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  availableFormations: JsonFormationShell[] = [];
  poolUser: PoolUser | undefined;
  nameService = new NameService();
  superElfNameService = new SuperElfNameService();
  assembleLines: AssembleLine[] = [];

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected playerRepository: PlayerRepository,
    protected scoutedPersonRepository: ScoutedPersonRepository,
    protected activeConfigRepository: ActiveConfigRepository,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      formation: [undefined]
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      this.onChanges();

      // hier een concat map doen om assembleFormation op te halen
      // en daarna activeConfigRepo, kan dus door bv. pooluser op te halen

      this.activeConfigRepository.getObject().pipe(
        concatMap((config: ActiveConfig) => {
          this.availableFormations = config.getAvailableFormations();
          return this.poolUserRepository.getObjectFromSession(pool);
        })
      ).subscribe(
        /* happy path */(poolUser: PoolUser) => {
          this.poolUser = poolUser;
          this.form.controls.formation.setValue(this.availableFormations.find(formation => {
            return formation.name === poolUser.getAssembleFormation()?.getName();
          }));

        },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );

      // this.setScountingList(pool);
      // this.searchPersons(pool);
    });
  }

  onChanges(): void {
    this.form.controls.formation.valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]) => {
        if (prev === undefined && next) {
          console.log('add formation', next);
          this.addFormation(next);
        } else if (prev && next === undefined) {
          console.log('remove formation', prev);
          //    console.log('remove formation', this.form.controls.formation.value, val);
        } else { // update
          console.log('update formation', prev, next);
          //    console.log('update formation', this.form.controls.formation.value, val);
        }
      },
      /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; });

    //  .valueChanges.subscribe(val => {

    // });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.formation !== undefined) {
  //     if (changes.formation.previousValue === undefined && changes.formation.currentValue !== undefined) {
  //       console.log('add formation');
  //       // this.addFormation();
  //     }
  //     if (changes.formation.previousValue !== undefined && changes.formation.currentValue !== undefined) {
  //       console.log('update formation');
  //       // this.add();
  //     }
  //   }
  // }

  protected addFormation(newFormation: JsonFormationShell) {
    if (!this.poolUser) {
      return;
    }

    this.formationRepository.createObject(newFormation, this.poolUser).subscribe(
      /* happy path */(formation: Formation) => {
        this.changeAssembleLines(formation);
      },
      /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
      /* onComplete */() => this.processing = false
    );
  }

  changeFormation() {
    const newFormation: JsonFormationShell = this.form.controls.formation.value;
    // if (this.form.controls.formation.value)
    //   this.formationRepository.getObject().pipe(
    //     concatMap((config: ActiveConfig) => {
    //       this.availableFormations = config.getAvailableFormations();
    //       return this.poolUserRepository.getObjectFromSession(pool);
    //     })
    //   ).subscribe(
    //     /* happy path */(poolUser: PoolUser) => {
    //       this.poolUser = poolUser;
    //       this.form.controls.formation.setValue(this.availableFormations.find(formation => {
    //         return formation.name === poolUser.getAssembleFormation()?.getName();
    //       }));
    //     },
    //     /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
    //     /* onComplete */() => this.processing = false
    //   );

    // this.changeAssembleLines(newFormation);


    // console.log(newFormation.lines);
  }

  changeAssembleLines(formation: Formation) {
    this.assembleLines = [];
    formation.getLines().forEach((formationLine: FormationLine) => {
      const persons = formationLine.getPersons().slice();
      const assemblePlayers: (Player | undefined)[] = [];
      for (let i = 1; i <= formationLine.getMaxNrOfPersons(); i++) {
        const person = persons.shift();
        assemblePlayers.push(person ? person.getPlayer() : undefined);
      }
      const substitute = formationLine.getSubstitute()?.getPlayer();
      const assembleLine: AssembleLine = {
        number: formationLine.getNumber(),
        players: assemblePlayers,
        substitute
      };
      this.assembleLines.push(assembleLine);
    });
  }

  choosePerson(lineNumer: number) {
    console.log('TODO choosePerson for line ' + lineNumer);
  }

  removePerson(person: Person) {
    console.log('TODO removePerson');
  }

  substitute(assembleLine: AssembleLine) {

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

interface AssembleLine {
  number: number;
  players: (Player | undefined)[];
  substitute: Player | undefined;
}