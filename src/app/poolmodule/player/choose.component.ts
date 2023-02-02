import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Competition, FootballLine, NameService, Person, PersonMap, Player, Team, TeamMap } from 'ngx-sport';
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
  @Input() competition!: Competition;
  @Input() viewPeriod!: ViewPeriod;
  @Input() alreadyChosenPersons: Person[] | undefined;
  @Input() alreadyChosenTeams: Team[] | undefined;
  @Input() selectableTeams!: Team[];
  @Input() selectableLines!: (FootballLine|undefined)[];
  @Input() filter: ChoosePlayersFilter;
  @Input() showAll: boolean = false;

  @Output() selectS11Player = new EventEmitter<S11Player>();
  @Output() selectPlayer = new EventEmitter<Player>();
  @Output() linkToS11Player = new EventEmitter<S11Player>();
  @Output() filterUpdate = new EventEmitter<ChoosePlayersFilter>();  
  form: UntypedFormGroup;
  choosePersonItems: ChoosePersonItem[] = [];
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
    fb: UntypedFormBuilder
  ) {
    this.filter = {
      line: undefined,
      team: undefined
    };

    this.form = fb.group({
      searchTeam: [],
      searchLine: [],
    });
  }

  ngOnInit() {
    // initTeams
    this.form.controls.searchTeam.setValue(this.filter.team);
    if (this.selectableTeams.length <= 1) {
      this.form.controls.searchTeam.disable();
    }

    // initFormationLines
    if( this.selectableLines === undefined) {
      this.selectableLines = [undefined];
      for (const [propertyKey, propertyValue] of Object.entries(FootballLine)) {
        if ((typeof propertyValue === 'string')) {
          continue;
        }
        this.selectableLines.push(propertyValue);
      }
    }
    this.form.controls.searchLine.setValue(this.filter.line);
    if (this.selectableLines.length <= 1) {
      this.form.controls.searchLine.disable();
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
    this.playerRepository.getObjects(this.competition, this.viewPeriod, this.filter.team, this.filter.line)
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

  select(s11Player: S11Player, player: Player) {
    this.selectS11Player.emit(s11Player);
    this.selectPlayer.emit(player);
  }

  setChoosePersonItems(players: S11Player[]) {
    const choosePersonItems: ChoosePersonItem[] = [];
    players.forEach((player: S11Player) => {
      const currentPlayer = this.oneTeamSimultaneous.getCurrentPlayer(player);
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
      && (this.selectableLines.length === 0 || this.inSelectableLines(player.getLine()));
  }

  inSelectableLines(footballLine: FootballLine): boolean {
    return this.selectableLines.find((lineIt: FootballLine|undefined): boolean => lineIt === footballLine) !== undefined;
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
  line: FootballLine | undefined;
  team: Team | undefined;
}

export interface ChoosePlayersReadonly {
  line: boolean;
  team: boolean;
}