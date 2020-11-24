import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, Person, PersonMap, Player, SportCustom, Team, TeamMap } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { ScoutedPerson } from '../../lib/scoutedPerson';
import { Pool } from '../../lib/pool';
import { TeamCompetitor } from 'ngx-sport/src/competitor/team';

@Component({
  selector: 'app-pool-choosepersons',
  templateUrl: './choosepersons.component.html',
  styleUrls: ['./choosepersons.component.scss']
})
export class ChoosePersonsComponent extends PoolComponent implements OnInit, OnChanges {
  @Output() selectPlayer = new EventEmitter<Player>();
  @Input() selectedPersonMap: PersonMap = new PersonMap();
  @Input() selectedSearchLine: number = 0;
  @Input() selectWarningTeamMap: TeamMap = new TeamMap();

  form: FormGroup;
  foundPlayers: Player[] | undefined;
  searchTeams: Team[] = [];
  searchLines: number[] = [];
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
      searchLine: [SportCustom.Football_Line_All],
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      this.form.controls.searchTeam.setValue(undefined);
      this.searchTeams = pool.getSourceCompetition().getTeamCompetitors().map((teamCompetitor: TeamCompetitor) => teamCompetitor.getTeam());

      this.searchLines.push(SportCustom.Football_Line_All);
      for (let line = 1; line < SportCustom.Football_Line_All; line *= 2) {
        this.searchLines.push(line);
      }
      if (this.selectedSearchLine) {
        this.form.controls.searchLine.setValue(this.selectedSearchLine);
      }
      this.searchPersons(pool);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // @TODO teams die je al hebt, moeten met een warning kunnen oplichten
    // dus een soort van selectWarningTeams

    if (this.pool && changes.selectedSearchLine !== undefined && changes.selectedSearchLine.currentValue !== changes.selectedSearchLine.previousValue
      && changes.selectedSearchLine.firstChange === false) {
      this.form.controls.searchLine.setValue(changes.selectedSearchLine.currentValue);
      this.searchPersons(this.pool);
    }
  }

  searchPersons(pool: Pool) {
    const sourceCompetition = pool.getSourceCompetition();
    const lineFilter = this.form.controls.searchLine.value;
    const teamFilter = this.form.controls.searchTeam.value;
    this.playerRepository.getObjects(sourceCompetition, teamFilter, lineFilter).subscribe((players: Player[]) => {
      this.foundPlayers = players;
      console.log(players);
    },
      /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
      /* onComplete */() => { this.processing = false });
  }

  select(player: Player) {
    this.selectPlayer.emit(player);
  }

  alreadySelected(person: Person): boolean {
    return this.selectedPersonMap.has(+person.getId());
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


}
