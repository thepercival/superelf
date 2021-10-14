import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FootballLine, NameService, Person, PersonMap, Player, Team, TeamMap } from 'ngx-sport';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { TeamCompetitor } from 'ngx-sport/src/competitor/team';
import { ViewPeriod } from '../../lib/period/view';
import { IAlert } from '../../shared/commonmodule/alert';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { S11PlayerRepository } from '../../lib/player/repository';
import { PointsCalculator } from '../../lib/points/calculator';

@Component({
  selector: 'app-pool-choosepersons',
  templateUrl: './choosepersons.component.html',
  styleUrls: ['./choosepersons.component.scss']
})
export class ChoosePersonsComponent implements OnInit, OnChanges {
  @Input() viewPeriod!: ViewPeriod;
  @Input() selectedPersonMap: PersonMap = new PersonMap();
  @Input() selectedSearchLine: number = 0;
  @Input() selectableLines: number = FootballLine.All;
  @Input() selectWarningTeamMap: TeamMap = new TeamMap();
  @Output() selectPerson = new EventEmitter<Person>();

  form: FormGroup;
  choosePersonItems: ChoosePersonItem[] = [];
  searchTeams: Team[] = [];
  searchLines: number[] = [];
  nameService = new NameService();
  public alert: IAlert | undefined;
  public processing = true;
  public oneTeamSimultaneous = new OneTeamSimultaneous();

  constructor(
    protected playerRepository: S11PlayerRepository,
    protected scoutedPersonRepository: ScoutedPersonRepository,
    protected pointsCalculator: PointsCalculator,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {

    this.form = fb.group({
      searchTeam: [undefined],
      searchLine: [FootballLine.All],
    });
  }

  ngOnInit() {
    this.form.controls.searchTeam.setValue(undefined);
    this.searchTeams = this.viewPeriod.getSourceCompetition().getTeamCompetitors().map((teamCompetitor: TeamCompetitor) => teamCompetitor.getTeam());

    this.searchLines.push(FootballLine.All);
    for (let line = 1; line < FootballLine.All; line *= 2) {
      this.searchLines.push(line);
    }
    if (this.selectedSearchLine) {
      this.form.controls.searchLine.setValue(this.selectedSearchLine);
    }
    this.searchPersons();

  }

  ngOnChanges(changes: SimpleChanges) {
    // @TODO teams die je al hebt, moeten met een warning kunnen oplichten
    // dus een soort van selectWarningTeams

    if (this.viewPeriod && changes.selectedSearchLine !== undefined && changes.selectedSearchLine.currentValue !== changes.selectedSearchLine.previousValue
      && changes.selectedSearchLine.firstChange === false) {
      this.form.controls.searchLine.setValue(changes.selectedSearchLine.currentValue);
      this.searchPersons();
    }
  }

  searchPersons() {
    const lineFilter = this.form.controls.searchLine.value;
    const teamFilter = this.form.controls.searchTeam.value;

    // haal alle persons op met viewperiods spelers op 
    // dit is dan inclusief de statistics
    // wanneer incl. en wanneer exclusief statistics?????

    this.playerRepository.getObjects(this.viewPeriod, teamFilter, lineFilter).subscribe(
      (players: S11Player[]) => {
        this.setChoosePersonItems(players);
      },
      /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
      /* onComplete */() => { this.processing = false });
  }

  select(player: S11Player) {
    this.selectPerson.emit(player.getPerson());
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

  setChoosePersonItems(players: S11Player[]) {
    const choosePersonItems: ChoosePersonItem[] = [];
    players.forEach((player: S11Player) => {
      const currentPlayer = this.oneTeamSimultaneous.getCurrentPlayer(player.getPerson());
      if (currentPlayer) {
        choosePersonItems.push({ player: currentPlayer, s11Player: player });
      }
    });
    choosePersonItems.sort((itemA, itemB) => itemA.s11Player.getTotalPoints() < itemB.s11Player.getTotalPoints() ? 1 : -1);
    this.choosePersonItems = choosePersonItems;
  }

  isSelectable(player: Player): boolean {
    return !this.alreadySelected(player.getPerson()) && (this.selectableLines & player.getLine()) > 0;
  }

  alreadySelected(person: Person): boolean {
    return this.selectedPersonMap.has(+person.getId());
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
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

interface ChoosePersonItem {
  s11Player: S11Player;
  player: Player;
}
