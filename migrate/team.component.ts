import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../src/app/lib/pool/repository';
import { PoolComponent } from '../src/app/shared/poolmodule/component';
import { NameService, Person, Player, Team, FootballLine } from 'ngx-sport';
import { PlayerRepository } from '../src/app/lib/ngx-sport/player/repository';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPlayerRepository } from '../src/app/lib/scoutedPlayer/repository';
import { ScoutedPlayer } from '../src/app/lib/scoutedPlayer';
import { Pool } from '../src/app/lib/pool';
import { TeamCompetitor } from 'ngx-sport/src/competitor/team';
import { ConfirmS11PlayerChoiceModalComponent } from '../chooseplayers/confirmchoicemodal.component';
import { S11Player } from '../src/app/lib/player';
import { ViewPeriod } from '../src/app/lib/period/view';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TitleComponent } from '../src/app/shared/commonmodule/title/title.component';


@Component({
  selector: 'app-pool-team',
  standalone: true,
  imports: [FontAwesomeModule,NgbAlertModule,TitleComponent],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  foundPlayers: Player[] | undefined;
  searchTeams: Team[] = [];
  searchLines: number[] = [];
  scoutedPlayers: ScoutedPlayer[] = [];
  nameService = new NameService();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected playerRepository: PlayerRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      searchTeam: [undefined],
      searchLine: [FootballLine.All],
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.pool = pool;
        this.form.controls.searchTeam.setValue(undefined);
        this.searchTeams = pool.getSourceCompetition().getTeamCompetitors().map((teamCompetitor: TeamCompetitor) => teamCompetitor.getTeam());

        this.searchLines.push(FootballLine.All);
        for (let line = 1; line < FootballLine.All; line *= 2) {
          this.searchLines.push(line);
        }

        this.setScountingList(pool.getAssembleViewPeriod());
        this.searchPersons(pool);
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      }
    });
  }

  searchPersons(pool: Pool) {
    const sourceCompetition = pool.getSourceCompetition();
    const lineFilter = this.form.controls.searchLine.value;
    const teamFilter = this.form.controls.searchTeam.value;
    this.playerRepository.getObjects(sourceCompetition, teamFilter, lineFilter).subscribe({
      next: (players: Player[]) => this.foundPlayers = players,
      error: (e) => { this.setAlert('danger', e); this.processing = false; },
      complete: () => this.processing = false
    });
  }

  setScountingList(viewPeriod: ViewPeriod) {
    this.scoutedPlayerRepository.getObjects(viewPeriod).subscribe({
      next: (scoutedPlayers: ScoutedPlayer[]) => {
        this.scoutedPlayers = scoutedPlayers;
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      }
    });
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

  addToScoutingList(s11Player: S11Player, viewPeriod: ViewPeriod) {
    this.processing = true;
    this.scoutedPlayerRepository.createObject(s11Player, viewPeriod).subscribe({
      next: (scoutedPlayer: ScoutedPlayer) => {
        this.scoutedPlayers.push(scoutedPlayer);
        this.openConfirmModal(scoutedPlayer.getS11Player());
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      },
      complete: () => this.processing = false
    });
  }

  openConfirmModal(s11Player: S11Player) {
    const modalRef = this.modalService.open(ConfirmS11PlayerChoiceModalComponent);
    modalRef.componentInstance.s11Player = s11Player;
    modalRef.result.then((result) => {
      if (result === 'toscouting')
        this.router.navigate(['/pool/scouting', this.pool.getId()]);
    }, (reason) => {
    });
  }

  inScoutingList(s11Player: S11Player): boolean {
    return this.scoutedPlayers.some(scoutedPlayer => scoutedPlayer.getPerson() === s11Player);
  }
}
