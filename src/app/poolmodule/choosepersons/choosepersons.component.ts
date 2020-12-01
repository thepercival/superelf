import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, Person, PersonMap, Player, SportCustom, Team, TeamMap } from 'ngx-sport';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { Pool } from '../../lib/pool';
import { TeamCompetitor } from 'ngx-sport/src/competitor/team';
import { CompetitionPersonRepository } from '../../lib/competitionPerson/repository';
import { CompetitionPerson } from '../../lib/competitionPerson';
import { ScoreUnitMap } from '../../lib/pool/scoreUnit/mapper';
import { PoolScoreUnit } from '../../lib/pool/scoreUnit';
import { GameRoundStats } from '../../lib/competitionPerson/gameRoundStats';
import { ScoreUnitCalculator } from '../../lib/scoreUnit/calculator';

@Component({
  selector: 'app-pool-choosepersons',
  templateUrl: './choosepersons.component.html',
  styleUrls: ['./choosepersons.component.scss']
})
export class ChoosePersonsComponent extends PoolComponent implements OnInit, OnChanges {
  @Input() selectedPersonMap: PersonMap = new PersonMap();
  @Input() selectedSearchLine: number = 0;
  @Input() selectableLines: number = SportCustom.Football_Line_All;
  @Input() selectWarningTeamMap: TeamMap = new TeamMap();
  @Output() selectPlayer = new EventEmitter<Player>();

  form: FormGroup;
  foundCompetitionPersons: CompetitionPerson[] | undefined;
  searchTeams: Team[] = [];
  searchLines: number[] = [];
  nameService = new NameService();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected competitionPersonRepository: CompetitionPersonRepository,
    protected scoutedPersonRepository: ScoutedPersonRepository,
    protected scoreUnitCalculator: ScoreUnitCalculator,
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
    this.competitionPersonRepository.getObjects(sourceCompetition, teamFilter, lineFilter).subscribe(
      (competitionPersons: CompetitionPerson[]) => {
        this.foundCompetitionPersons = competitionPersons;
      },
      /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
      /* onComplete */() => { this.processing = false });
  }

  select(player: Player) {
    this.selectPlayer.emit(player);
  }

  // getPlayers(competitionPersons: CompetitionPerson[]): Player[] {
  //   const players: Player[] = [];
  //   competitionPersons.forEach(competitionPerson => {
  //     const player = competitionPerson.getPerson().getPlayerOneTeamSim();
  //     if (player) {
  //       players.push(player);
  //     }
  //   });
  //   return players;
  // }

  getPoints(competitionPerson: CompetitionPerson): number {
    return this.scoreUnitCalculator.getPoints(this.pool.getScoreUnits(), competitionPerson.getGameRoundStats());
  }

  isSelectable(player: Player): boolean {
    return !this.alreadySelected(player.getPerson()) && (this.selectableLines & player.getLine()) > 0;
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
