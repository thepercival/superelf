import { Component, EventEmitter, OnInit, Output, WritableSignal, input, model, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Competition, FootballLine, NameService, Person, PersonMap, Player, Team, TeamMap } from 'ngx-sport';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { ViewPeriod } from '../../lib/period/view';
import { IAlert } from '../../shared/commonmodule/alert';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { S11PlayerRepository } from '../../lib/player/repository';
import { ImageRepository } from '../../lib/image/repository';
import { ViewPeriodType } from '../../lib/period/view/json';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { TeamNameComponent } from '../team/name.component';
import { NgIf } from '@angular/common';
import { faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-pool-player-choose",
  standalone: true,
  imports: [FontAwesomeModule,LineIconComponent,TeamNameComponent,NgIf],
  templateUrl: "./choose.component.html",
  styleUrls: ["./choose.component.scss"],
})
export class S11PlayerChooseComponent implements OnInit {
  readonly competitionConfig = input.required<CompetitionConfig>();
  readonly viewPeriod = input.required<ViewPeriod>();
  readonly alreadyChosenPersons = input<Person[]>();
  readonly alreadyChosenTeams = input<Team[]>();
  readonly selectableTeams = input.required<Team[]>();
  readonly selectableLines = input.required<(FootballLine)[]>();
  readonly filter = model.required<ChoosePlayersFilter>();
  readonly showAll = input<boolean>(false);
  readonly viewPeriodType = input.required<ViewPeriodType>();
  public faChevronRight = faChevronRight;

  @Output() selectS11Player = new EventEmitter<S11Player>();
  @Output() selectPlayer = new EventEmitter<Player>();
  @Output() linkToS11Player = new EventEmitter<S11Player>();
  @Output() filterUpdate = new EventEmitter<ChoosePlayersFilter>();
  form: UntypedFormGroup;
  choosePersonItems: ChoosePersonItem[] = [];
  nameService = new NameService();
  public alert: IAlert | undefined;
  public processing: WritableSignal<boolean> = signal(true);
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  private alreadyChosenPersonsMap!: PersonMap;
  private alreadyChosenTeamsMap!: TeamMap;

  public faSpinner = faSpinner;
  
  constructor(
    protected playerRepository: S11PlayerRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    public imageRepository: ImageRepository,
    fb: UntypedFormBuilder
  ) {
    this.filter.set({
      line: undefined,
      team: undefined,
    });

    this.form = fb.group({
      searchTeam: [],
      searchLine: [],
    });
  }

  ngOnInit() {
    // initTeams
    const filter = this.filter();
    this.form.controls.searchTeam.setValue(filter.team);
    if (this.selectableTeams().length <= 1) {
      this.form.controls.searchTeam.disable();
    }

    this.form.controls.searchLine.setValue(filter.line);
    if (this.selectableLines().length <= 1) {
      this.form.controls.searchLine.disable();
    }

    this.alreadyChosenPersonsMap = new PersonMap();
    this.alreadyChosenPersons()?.forEach((person: Person) => {
      this.alreadyChosenPersonsMap.set(+person.getId(), person);
    });
    this.alreadyChosenTeamsMap = new TeamMap();
    this.alreadyChosenTeams()?.forEach((team: Team) => {
      this.alreadyChosenTeamsMap.set(+team.getId(), team);
    });
    // console.log(this.showAll)
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
    this.playerRepository
      .getObjects(
        this.competitionConfig().getSourceCompetition(),
        this.viewPeriod(),
        this.filter().team,
        this.filter().line
      )
      .subscribe({
        next: (players: S11Player[]) => {
          this.setChoosePersonItems(players);
        },
        error: (e) => {
          this.setAlert("danger", e);
          this.processing.set(false);
        },
        complete: () => (this.processing.set(false)),
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
    choosePersonItems.sort((itemA, itemB) =>
      this.getTotalPoints(itemA.s11Player) <
      this.getTotalPoints(itemB.s11Player)
        ? 1
        : -1
    );
    this.choosePersonItems = choosePersonItems;
  }

  getTotalPoints(s11Player: S11Player): number {
    return s11Player.getTotalPoints(
      this.competitionConfig().getScorePointsMap(),
      undefined
    );
  }

  isChoosable(player: Player): boolean {
    // console.log('pac' + player.getPerson().getName(), this.personAlreadyChosen(player.getPerson()));
    // console.log('tac' + player.getPerson().getName(), this.teamAlreadyChosen(player.getTeam()));
    return (
      !this.personAlreadyChosen(player.getPerson()) &&
      !this.teamAlreadyChosen(player.getTeam()) &&
      (this.selectableLines().length === 0 ||
        this.inSelectableLines(player.getLine()))
    );
  }

  inSelectableLines(footballLine: FootballLine): boolean {
    return (
      this.selectableLines().find(
        (lineIt: FootballLine | undefined): boolean => lineIt === footballLine
      ) !== undefined
    );
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
    this.alert = { type: type, message: message };
  }

  get TransferViewPeriod(): ViewPeriodType {
    return ViewPeriodType.Transfer;
  }

  linkToPlayer(choosePersonItem: ChoosePersonItem): void {
    if (this.viewPeriodType() === ViewPeriodType.Transfer) {
      if (this.isChoosable(choosePersonItem.player)) {
        this.select(choosePersonItem.s11Player, choosePersonItem.player);
      }
    } else {
      this.linkToS11Player.emit(choosePersonItem.s11Player);
    }
  }

  updateFilter() {
    this.filter.set({
      line: this.form.controls.searchLine.value,
      team: this.form.controls.searchTeam.value,
    });
    this.searchPersons();
    this.filterUpdate.emit(this.filter());
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