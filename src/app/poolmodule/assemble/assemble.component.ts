import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, Person, PersonMap, TeamMap, Team, FootballLine, Formation } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { Pool } from '../../lib/pool';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { concatMap, map, pairwise } from 'rxjs/operators';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
import { Observable, of } from 'rxjs';
import { S11Player } from '../../lib/player';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { ActiveConfig } from '../../lib/activeConfig';
import { S11FormationLine } from '../../lib/formation/line';
import { S11FormationPlace } from '../../lib/formation/place';
import { S11Formation } from '../../lib/formation';

@Component({
  selector: 'app-pool-assemble',
  templateUrl: './assemble.component.html',
  styleUrls: ['./assemble.component.scss']
})
export class AssembleComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  nameService = new NameService();
  showSearchSMDown: boolean = false;
  teamPersonMap = new PersonMap();
  selectedPlace: S11FormationPlace | undefined;
  updatingPlayer = false;
  selectedSearchLine: number = FootballLine.All;
  selectedTeamMap: TeamMap = new TeamMap();
  public oneTeamSimultaneous = new OneTeamSimultaneous();

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
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;

      this.activeConfigRepository.getObject().pipe(
        concatMap((config: ActiveConfig) => {
          return this.poolUserRepository.getObjectFromSession(pool);
        })
      ).subscribe(
        /* happy path */(poolUser: PoolUser) => {
          this.poolUser = poolUser;
          // const s11Formation = poolUser.getAssembleFormation();
          // if (!s11Formation) {
          //   this.form.controls.formation.setValue(undefined);
          //   return;
          // }
          // this.assembleLines = this.getAssembleLines(formation);
        },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
    });
  }

  getFormationName(): string {
    return this.poolUser.getAssembleFormation()?.getName() ?? 'kies formatie';
  }


  // getAssembleLines(formation?: S11Formation): AssembleLine[] {
  //   const assembleLines: AssembleLine[] = [];
  //   if (!formation) {
  //     return assembleLines;
  //   }
  //   formation.getLines().forEach((formationLine: S11FormationLine) => {
  //     const players = formationLine.getPlayers().slice();
  //     const places: AssembleLinePlace[] = [];
  //     for (let i = 1; i <= formationLine.getNrOfPersons(); i++) {
  //       const player = players.shift();
  //       places.push({
  //         lineNumber: formationLine.getNumber(),
  //         number: 1,
  //         player,
  //         substitute: false
  //       });
  //     }
  //     const substitute: AssembleLinePlace = {
  //       lineNumber: formationLine.getNumber(),
  //       number: 1,
  //       player: formationLine.getSubstitute(),
  //       substitute: true
  //     };
  //     assembleLines.push({
  //       number: formationLine.getNumber(), places, substitute
  //     });
  //   });
  //   return assembleLines;
  // }

  selectPlace(place: S11FormationPlace) {
    this.selectedPlace = place;
    this.selectedSearchLine = place.getFormationLine().getNumber();
    this.selectedTeamMap = this.getSelectedTeamMap();
  }

  getSelectedTeamMap(): TeamMap {
    const teamMap: TeamMap = new TeamMap();
    const formation = this.poolUser.getAssembleFormation();
    if (!formation) {
      return teamMap;
    }
    formation.getLines().forEach((line: S11FormationLine) => {
      line.getPlaces().forEach((formationPlace: S11FormationPlace) => {
        const player = formationPlace.getPlayer();
        const currentPlayer = player ? this.oneTeamSimultaneous.getCurrentPlayer(player.getPerson()) : undefined;
        if (currentPlayer) {
          teamMap.set(+currentPlayer.getTeam().getId(), currentPlayer.getTeam());
        }
      });
    });
    return teamMap;
  }

  updatePlace(person: Person, smDown: boolean) {
    const formation = this.poolUser.getAssembleFormation();
    if (!formation) {
      return;
    }
    const selectedPlace = this.selectedPlace;
    if (!selectedPlace) {
      return;
    }
    const line = formation.getLine(selectedPlace?.getFormationLine().getNumber());
    if (!line) {
      return;
    }
    this.updatingPlayer = true;
    // @TODO CDK
    // this.removeSelected(line).subscribe(
    //     /* happy path */() => {
    //     const player = this.oneTeamSimultaneous.getCurrentPlayer(person);
    //     const team = player?.getTeam();
    //     this.removeSameTeam(formation, team).subscribe(
    //     /* happy path */() => {
    //         // check if someOne from same team is in formation, than show modal and 
    //         const viewPeriod = this.pool.getAssemblePeriod().getViewPeriod();
    //         this.formationRepository.addPerson(person, line, selectedPlace.substitute !== undefined).subscribe(
    //         /* happy path */() => {
    //             this.selectedPlace = undefined;
    //             this.assembleLines = this.getAssembleLines(formation);
    //             this.showSearchSMDown = false;
    //           },
    //               /* error path */(e: string) => { this.setAlert('danger', e); this.updatingPlayer = false; },
    //               /* onComplete */() => this.updatingPlayer = false
    //         );
    //       },
    //     /* error path */(e: string) => { this.setAlert('danger', e); this.updatingPlayer = false; }
    //     );
    //   },
    //     /* error path */(e: string) => { this.setAlert('danger', e); this.updatingPlayer = false; }
    // );

  }

  protected removeSelected(line: S11FormationLine): Observable<void | number> {
    const selectedPlace = this.selectedPlace;
    if (!selectedPlace) {
      return of(0);
    }
    return of(0);
    // @TODO CDK
    // const player = selectedPlace.player;
    // if (!player) {
    //   return of(0);
    // }    
    // if (selectedPlace.substitute) {
    //   return this.formationRepository.removeSubstitute(player, line);
    // }
    // return this.formationRepository.removePlayer(player, line);
  }

  protected removeSameTeam(formation: Formation, team: Team | undefined): Observable<void | number> {
    // @TODO CDK
    return of(0);
    // if (!team) {
    //   return of(0);
    // }
    // // const selectedPlace = this.selectedPlace;
    // // if (!selectedPlace) {
    // //   return of(0);
    // // }
    // const player = formation.getPlayer(team);
    // if (!player) {
    //   return of(0);
    // }
    // const currentPlayer = this.oneTeamSimultaneous.getCurrentPlayer(player.getPerson());
    // if (!currentPlayer) {
    //   return of(0);
    // }
    // const line = formation.getLine(currentPlayer.getLine());
    // if (!line) {
    //   return of(0);
    // }
    // const substitute = line.getSubstitute()
    // if (substitute && substitute === player) {
    //   return this.formationRepository.removeSubstitute(substitute, line);
    // }
    // return this.formationRepository.removePlayer(player, line);
  }

  protected teamAlreadyPresent(team: Team): boolean {
    return this.poolUser.getAssembleFormation()?.getPlayer(team) !== undefined;
  }

  add(person: Person) {
    console.log('person selected: ' + person.getName());
  }

  choosePerson(lineNumer: number) {
    console.log('@TODO CDK choosePerson for line ' + lineNumer);
  }

  removePerson(person: Person) {
    console.log('@TODO CDK removePerson');
  }

  // substitute(assembleLine: AssembleLine) {

  // }
}
