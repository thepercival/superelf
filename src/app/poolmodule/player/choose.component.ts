import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FootballLine, NameService, Person, PersonMap, Player, Team, TeamMap } from 'ngx-sport';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { TeamCompetitor } from 'ngx-sport/src/competitor/team';
import { ViewPeriod } from '../../lib/period/view';
import { IAlert } from '../../shared/commonmodule/alert';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { S11PlayerRepository } from '../../lib/player/repository';
import { ImageRepository } from '../../lib/image/repository';

@Component({
  selector: 'app-pool-player-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.scss']
})
export class S11PlayerChooseComponent implements OnInit {
  @Input() viewPeriod!: ViewPeriod;
  @Input() alreadyChosenPersons: Person[] | undefined;
  @Input() alreadyChosenTeams: Team[] | undefined;
  @Input() selectableLines: number = FootballLine.All;
  @Input() filter: ChoosePlayersFilter;
  @Input() showAll: boolean = false;

  @Output() selectS11Player = new EventEmitter<S11Player>();
  @Output() linkToS11Player = new EventEmitter<S11Player>();
  @Output() filterUpdate = new EventEmitter<ChoosePlayersFilter>();

  form: FormGroup;
  choosePersonItems: ChoosePersonItem[] = [];
  searchTeams: Team[] = [];
  searchLines: number[] = [];
  nameService = new NameService();
  public alert: IAlert | undefined;
  public processing = true;
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  private alreadyChosenPersonsMap!: PersonMap;
  private alreadyChosenTeamsMap!: TeamMap;

  constructor(
    protected playerRepository: S11PlayerRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    public imageRepository: ImageRepository,
    fb: FormBuilder
  ) {
    this.filter = {
      line: FootballLine.All,
      team: undefined
    };

    this.form = fb.group({
      searchTeam: [],
      searchLine: [],
    });
  }

  ngOnInit() {
    this.searchTeams = this.viewPeriod.getSourceCompetition().getTeamCompetitors().map((teamCompetitor: TeamCompetitor) => teamCompetitor.getTeam());
    this.form.controls.searchTeam.setValue(this.filter.team);

    this.searchLines.push(FootballLine.All);
    for (let line = 1; line < FootballLine.All; line *= 2) {
      this.searchLines.push(line);
    }
    if (this.filter.line) {
      this.form.controls.searchLine.setValue(this.filter.line);
    }
    this.alreadyChosenPersonsMap = new PersonMap();
    this.alreadyChosenPersons?.forEach((person: Person) => {
      this.alreadyChosenPersonsMap.set(+person.getId(), person);
    });
    this.alreadyChosenTeamsMap = new TeamMap();
    this.alreadyChosenTeams?.forEach((team: Team) => {
      this.alreadyChosenTeamsMap.set(+team.getId(), team);
    });
    this.searchPersons();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // @TODO teams die je al hebt, moeten met een warning kunnen oplichten
  //   // dus een soort van selectWarningTeams

  //   if (this.viewPeriod && changes.selectedSearchLine !== undefined && changes.selectedSearchLine.currentValue !== changes.selectedSearchLine.previousValue
  //     && changes.selectedSearchLine.firstChange === false) {
  //     this.form.controls.searchLine.setValue(changes.selectedSearchLine.currentValue);
  //     this.searchPersons();
  //   }
  // }

  searchPersons() {
    this.playerRepository.getObjects(this.viewPeriod, this.filter.team, this.filter.line)
      .subscribe({
        next: (players: S11Player[]) => {
          this.setChoosePersonItems(players);
        },
        error: (e) => {
          this.setAlert('danger', e); this.processing = false;
        },
        complete: () => this.processing = false
      });
  }

  select(player: S11Player) {
    this.selectS11Player.emit(player);
  }

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

  isChoosable(player: Player): boolean {
    // console.log('pac' + player.getPerson().getName(), this.personAlreadyChosen(player.getPerson()));
    // console.log('tac' + player.getPerson().getName(), this.teamAlreadyChosen(player.getTeam()));
    return !this.personAlreadyChosen(player.getPerson()) && !this.teamAlreadyChosen(player.getTeam())
      && (this.selectableLines & player.getLine()) > 0;
  }

  personAlreadyChosen(person: Person): boolean {
    return this.alreadyChosenPersonsMap.has(+person.getId());
  }

  teamAlreadyChosen(team: Team): boolean {
    return this.alreadyChosenTeamsMap.has(+team.getId());
  }

  getTeamImageUrl(choosePersonItem: ChoosePersonItem): string {
    return this.imageRepository.getTeamUrl(choosePersonItem.player.getTeam());
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  linkToPlayer(s11Player: S11Player): void {
    this.linkToS11Player.emit(s11Player);
  }

  updateFilter() {
    this.filter = {
      line: this.form.controls.searchLine.value,
      team: this.form.controls.searchTeam.value
    };
    this.searchPersons();
    this.filterUpdate.emit(this.filter);
  }
}

interface ChoosePersonItem {
  s11Player: S11Player;
  player: Player;
}

export interface ChoosePlayersFilter {
  line: FootballLine;
  team: Team | undefined;
}