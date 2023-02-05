import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine, Team, Person, Player, Formation, PlayerMapper, TeamCompetitor } from 'ngx-sport';
import { CompetitionConfigRepository } from '../../../lib/competitionConfig/repository';
import { FootballFormationChecker } from '../../../lib/formation/footballChecker';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { OneTeamSimultaneous } from '../../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../../lib/player';
import { Pool } from '../../../lib/pool';
import { PoolRepository } from '../../../lib/pool/repository';
import { PoolUser } from '../../../lib/pool/user';
import { PoolUserRepository } from '../../../lib/pool/user/repository';
import { ScoutedPlayer } from '../../../lib/scoutedPlayer';
import { GlobalEventsManager } from '../../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../../shared/commonmodule/navigation';
import { PoolComponent } from '../../../shared/poolmodule/component';
import { ChoosePlayersFilter } from '../../player/choose.component';
import { JsonTransfer } from '../../../lib/editAction/transfer/json';
import { S11Formation } from '../../../lib/formation';
import { S11FormationCalculator } from '../../../lib/formation/calculator';

@Component({
  selector: 'app-pool-place-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class FormationPlaceTransferComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  scoutingList: ScoutingList = { scoutedPlayers: []/*, mappedPersons: new PersonMap()*/ };
  public form: UntypedFormGroup;
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public choosePlayersFilter: ChoosePlayersFilter;
  public place!: S11FormationPlace;
  public alreadyChosenPersons: Person[] = [];
  public alreadyChosenTeams: Team[]|undefined;
  public selectableTeams: Team[]|undefined;
  public selectableLines!: FootballLine[];
  public formationChecker: FootballFormationChecker|undefined;
  public calcFormation: S11Formation|undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected poolUserRepository: PoolUserRepository,
    private location: Location,
    private playerMapper: PlayerMapper,
    private formationRepository: FormationRepository,
    protected competitionConfigRepository: CompetitionConfigRepository,
    public myNavigation: MyNavigation,
    private modalService: NgbModal,
    fb: UntypedFormBuilder
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.form = fb.group({
      showAll: false
    });

    const state = this.router.getCurrentNavigation()?.extras.state ?? undefined;
    this.choosePlayersFilter = state ? state.playerFilter : { line: undefined, team: undefined };
  }


  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);      

      this.competitionConfigRepository.getAvailableFormations(pool.getCompetitionConfig()).pipe(
        concatMap((formations: Formation[]) => {
          this.formationChecker = new FootballFormationChecker(formations);
          return this.poolUserRepository.getObjectFromSession(pool);
        })
      )
      .subscribe({
        next: (poolUser: PoolUser) => {
          this.poolUser = poolUser;
          const calculator = new S11FormationCalculator();
          this.calcFormation = calculator.getCurrentFormation(poolUser);
          this.route.params.subscribe(params => {
            if (params.lineNr !== undefined && params.placeNr !== undefined) {
              this.initPlace(+params.lineNr,+params.placeNr);
            }
          });
        },
        error: (e) => {
          this.setAlert('danger', e); this.processing = false;
        },
        complete: () => this.processing = false
      });     
    });
  }

  private initPlace(lineNumber: number, placeNumber: number) {
    this.place = this.getPlace(lineNumber, placeNumber);
    this.initPlayerChoose();
  }

  initPlayerChoose() {
    this.alreadyChosenPersons = [];
    const placeTeam = this.getTeamDescendingStart(this.place.getPlayer());

    const calculator = new S11FormationCalculator();
    const calcFormation = calculator.getCurrentFormation(this.poolUser);
    if( calcFormation === undefined ) {
      throw new Error();
    }
    const teams = calculator.getFormationTeams(calcFormation);
    const alreadyChosenTeams = teams.filter((team: Team): boolean => {
        return placeTeam !== team;
    });

    const teamCompetitors = this.pool.getSourceCompetition().getTeamCompetitors();
    this.selectableTeams = teamCompetitors.map((teamCompetitor: TeamCompetitor): Team => {
      return teamCompetitor.getTeam();
    }).filter((team: Team): boolean => {
        return alreadyChosenTeams.indexOf(team) < 0;
    });      
    this.alreadyChosenTeams = alreadyChosenTeams;
    
    const formationLine = this.place.getFormationLine();
    const formationChecker = this.formationChecker;
    if( formationChecker ) {
      console.log(formationLine.getFormation().convertToBase());
      const addableLines = formationChecker.addableLines(formationLine.getFormation().convertToBase(), formationLine.getNumber());      
      this.selectableLines = addableLines;
      // this.route.queryParams.subscribe(params => {
      //   if (params.line !== undefined) {
          this.choosePlayersFilter.line = this.place.getLine();
      //   }
      // ?});
    }    
  }

  getTeamDescendingStart(s11Player: S11Player|undefined): Team|undefined {
    // console.log(s11Player);
    return this.getPlayerDescendingStart(s11Player)?.getTeam();
  }

  getPlayerDescendingStart(s11Player: S11Player|undefined): Player|undefined {
    if( s11Player === undefined) {
      return undefined;
    }
    return s11Player.getPlayersDescendingStart().shift();
  }

  getPlace(lineNumber: number, placeNumber: number): S11FormationPlace {
    const place = this.calcFormation?.getPlace(lineNumber, placeNumber);
    if (place === undefined) {
      throw Error('de opstellings-plaats kan niet gevonden worden');
    }
    return place;
  }

  getTeamById(teamId: number): Team | undefined {
    const teamCompetitors = this.pool.getSourceCompetition().getTeamCompetitors();
    return teamCompetitors.map(teamCompetitor => teamCompetitor.getTeam()).find((team: Team): boolean => {
      return team.getId() === teamId;
    });
  }

  transfer(player: Player, placeOut: S11FormationPlace) {
    const s11Player = placeOut.getPlayer();
    if( s11Player === undefined) {
      throw new Error('player out can not be empty');
    }
    const playerOut = s11Player.getPlayersDescendingStart().shift();
    if( playerOut === undefined) {
      throw new Error('player out can not be empty');
    }
    this.processing = true; 
    const jsonTransfer: JsonTransfer = {
      id: 0,
      lineNumberOut: this.place.getLine(),
      placeNumberOut: this.place.getNumber(),
      playerIn: this.playerMapper.toJson(player),
      playerOut: this.playerMapper.toJson(player),
      createdDate: (new Date()).toISOString()
    }

    const transferPeriod = this.poolUser.getPool().getCompetitionConfig().getTransferPeriod();
    
    this.formationRepository.transfer(jsonTransfer, this.poolUser).subscribe({
      next: () => {
        if( this.poolUser.getTransfers().length < transferPeriod.getMaxNrOfTransfers()) {
          this.router.navigate(['/pool/formation/transfers', this.pool.getId()]);
        } else {
          this.router.navigate(['/pool/formation/substitutions', this.pool.getId()]);
        }
      },
      error: (e: string) => {
        this.setAlert('danger', e);
        this.processing = false
      },
      complete: () => this.processing = false
    });
  }


  updateShowAll() {
    this.updateState(this.choosePlayersFilter);
  }

  updateState(choosePlayersFilter: ChoosePlayersFilter) {
    this.choosePlayersFilter = choosePlayersFilter;

    let params = new HttpParams();
    if (choosePlayersFilter.line) {
      params = params.set('line', choosePlayersFilter.line);
    }
    if (choosePlayersFilter.team) {
      params = params.set('teamId', choosePlayersFilter.team.getId());
    }
    params = params.set('showAll', this.form.controls.showAll.value);

    this.location.replaceState(
      location.pathname,
      params.toString(),
      undefined
    );
  }

  linkToPlayer(s11Player: S11Player): void {
    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), 0]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }

  toggleShowAll() {

  }
}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}