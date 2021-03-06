import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from 'ngx-clipboard';
import {
  faListOl,
  faChevronRight,
  faEnvelope,
  faClipboardCheck,
  faUsers,
  faTimesCircle,
  faCheckCircle,
  faTrashAlt,
  faInfoCircle,
  faSearch,
  faPlusCircle,
  faPenAlt,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  CompetitionMapper,
  GameMapper,
  GamePlaceMapper,
  GameScoreMapper,
  PlaceMapper,
  PlanningMapper,
  PouleMapper,
  RoundMapper,
  RoundNumberMapper,
  SportConfigMapper,
  SportConfigService,
  SportScoreConfigMapper,
  SportScoreConfigService,
  StructureMapper,
  SportMapper,
  SeasonMapper,
  RefereeMapper,
  PlanningConfigMapper,
  LeagueMapper,
  FieldMapper,
  AssociationMapper,
} from 'ngx-sport';

import { CSSService } from '../shared/commonmodule/cssservice';
import { CommonSharedModule } from '../shared/commonmodule/common.module';
import { HomeComponent } from './home/home.component';
import { PreNewComponent } from './prenew/prenew.component';
import { RoutingModule } from './pool-routing.module';
import { PoolRepository } from '../lib/pool/repository';
import { PoolMapper } from '../lib/pool/mapper';
import { PoolSharedModule } from '../shared/poolmodule/pool.module';
import { NewComponent } from './new/new.component';
import { PoolCollectionMapper } from '../lib/pool/collection/mapper';
import { ScoreUnitMapper } from '../lib/scoreUnit/mapper';
import { RulesComponent } from './rules/rules.component';
import { JoinComponent } from './join/join.component';
import { PoolUserMapper } from '../lib/pool/user/mapper';
import { PoolCompetitorMapper } from '../lib/pool/competitor/mapper';
import { PoolUsersComponent } from './poolusers/poolusers.component';
import { PoolUserRepository } from '../lib/pool/user/repository';
import { RemoveApprovalModalComponent } from './removeapproval/removeapprovalmodal.component';
import { InviteComponent } from './invite/invite.component';
import { ScoutingComponent } from './scouting/scouting.component';
import { ScoutedPersonRepository } from '../lib/scoutedPerson/repository';
import { ScoutedPersonMapper } from '../lib/scoutedPerson/mapper';
import { PersonRepository } from '../lib/ngx-sport/person/repository';
import { ActiveConfigRepository } from '../lib/activeConfig/repository';
import { ActiveConfigMapper } from '../lib/activeConfig/mapper';
import { CompetitionRepository } from '../lib/ngx-sport/competition/repository';
import { PlayerRepository } from '../lib/ngx-sport/player/repository';
import { ChoosePersonsComponent } from './choosepersons/choosepersons.component';
import { ConfirmPersonChoiceModalComponent } from './choosepersons/confirmpersonchoicemodal.component';
import { PersonComponent } from './person/person.component';
import { ViewPeriodMapper } from '../lib/period/view/mapper';
import { AssembleComponent } from './assemble/assemble.component';
import { FormationMapper } from '../lib/formation/mapper';
import { FormationLineMapper } from '../lib/formation/line/mapper';
import { AssemblePeriodMapper } from '../lib/period/assemble/mapper';
import { TransferPeriodMapper } from '../lib/period/transfer/mapper';
import { EditActionMapper } from '../lib/editAction/mapper';
import { FormationRepository } from '../lib/formation/repository';
import { ChooseFormationComponent } from './assemble/chooseformation.component';
import { AssembleLineComponent } from './assemble/assembleline.component';
import { ScoreUnitCalculator } from '../lib/scoreUnit/calculator';
import { ViewPeriodPersonRepository } from '../lib/period/view/person/repository';
import { ViewPeriodPersonMapper } from '../lib/period/view/person/mapper';
import { GameRoundMapper } from '../lib/gameRound/mapper';
import { PoolUserViewPeriodPersonMapper } from '../lib/pool/user/viewPeriodPerson/mapper';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    PoolSharedModule,
    CommonSharedModule,
    ClipboardModule,
  ],
  declarations: [
    PreNewComponent,
    NewComponent,
    HomeComponent,
    InviteComponent,
    JoinComponent,
    PoolUsersComponent,
    RulesComponent,
    ScoutingComponent,
    ChoosePersonsComponent,
    PersonComponent,
    AssembleComponent,
    AssembleLineComponent,
    ChooseFormationComponent,
    ConfirmPersonChoiceModalComponent,
    RemoveApprovalModalComponent
  ],
  providers: [
    AssociationMapper,
    CompetitionMapper,
    CSSService,
    FieldMapper,
    FormationMapper,
    FormationLineMapper,
    GameMapper,
    GamePlaceMapper,
    GameScoreMapper,
    LeagueMapper,
    PlaceMapper,
    PlanningMapper,
    PlanningConfigMapper,
    PouleMapper,
    RefereeMapper,
    RoundMapper,
    RoundNumberMapper,
    SeasonMapper,
    SportMapper,
    SportConfigMapper,
    SportScoreConfigService,
    SportConfigService,
    SportScoreConfigMapper,
    StructureMapper,
    PoolRepository,
    PoolMapper,
    PoolCollectionMapper,
    PoolUserRepository,
    PoolUserMapper,
    PoolCompetitorMapper,
    ScoreUnitMapper,
    ScoutedPersonRepository,
    ScoutedPersonMapper,
    ViewPeriodPersonRepository,
    ViewPeriodPersonMapper,
    PersonRepository,
    PlayerRepository,
    ActiveConfigRepository,
    ActiveConfigMapper,
    CompetitionRepository,
    CompetitionMapper,
    AssemblePeriodMapper,
    TransferPeriodMapper,
    ViewPeriodMapper,
    GameRoundMapper,
    EditActionMapper,
    FormationRepository,
    ScoreUnitCalculator,
    PoolUserViewPeriodPersonMapper
  ]
})
export class PoolModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faListOl, faChevronRight, faEnvelope, faClipboardCheck, faUsers, faTimesCircle, faCheckCircle, faTrashAlt
      , faInfoCircle, faSearch, faPlusCircle, faPencilAlt/*faMoneyBillAlt, faCircle, faTimesCircle, faListUl, faCogs, faMinus, faTh,
      faCompressAlt, faExpandAlt, faFileExport, faFileExcel, faPrint, faSort, faRandom, faSquare, faCheckSquare,
      , faMedal, , faQrcode, faCopy, faDotCircle, faSync*/
    );
    /*library.addIcons(
      faProductHunt
    );*/
  }
}


