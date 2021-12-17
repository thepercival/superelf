import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from 'ngx-clipboard';
import {
  faListOl,
  faChevronLeft,
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
  ScoreMapper,
  PlaceMapper,
  PlanningMapper,
  PouleMapper,
  RoundMapper,
  RoundNumberMapper,
  CompetitionSportMapper,
  CompetitionSportService,
  AgainstQualifyConfigMapper,
  AgainstQualifyConfigService,
  StructureMapper,
  SportMapper,
  SeasonMapper,
  RefereeMapper,
  PlanningConfigMapper,
  LeagueMapper,
  FieldMapper,
  AssociationMapper,
  FormationMapper,
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
import { ScoutedPlayerRepository } from '../lib/scoutedPlayer/repository';
import { ScoutedPlayerMapper } from '../lib/scoutedPlayer/mapper';
import { PersonRepository } from '../lib/ngx-sport/person/repository';
import { ActiveConfigRepository } from '../lib/activeConfig/repository';
import { ActiveConfigMapper } from '../lib/activeConfig/mapper';
import { CompetitionRepository } from '../lib/ngx-sport/competition/repository';
import { PlayerRepository } from '../lib/ngx-sport/player/repository';
import { ChooseS11PlayersComponent } from './chooseplayers/list.component';
import { ConfirmS11PlayerChoiceModalComponent } from './chooseplayers/confirmchoicemodal.component';
import { ViewPeriodMapper } from '../lib/period/view/mapper';
import { AssembleComponent } from './assemble/assemble.component';
import { S11FormationMapper } from '../lib/formation/mapper';
import { S11FormationLineMapper } from '../lib/formation/line/mapper';
import { AssemblePeriodMapper } from '../lib/period/assemble/mapper';
import { TransferPeriodMapper } from '../lib/period/transfer/mapper';
import { EditActionMapper } from '../lib/editAction/mapper';
import { FormationRepository } from '../lib/formation/repository';
import { ChooseFormationComponent } from './assemble/chooseformation.component';
import { AssembleLineComponent } from './assemble/assembleline.component';
import { PointsCalculator } from '../lib/points/calculator';
import { S11PlayerRepository } from '../lib/player/repository';
import { S11PlayerMapper } from '../lib/player/mapper';
import { GameRoundMapper } from '../lib/gameRound/mapper';
import { StatisticsMapper } from '../lib/statistics/mapper';
import { SuperElfNameService } from '../lib/nameservice';
import { FormationPlaceMapper } from '../lib/formation/place/mapper';
import { ImageRepository } from '../lib/image/repository';
import { S11PlayerComponent } from './player/info.component';
import { S11PlayerInfoModalComponent } from './player/infomodal.component';
import { TeamNameComponent } from './team/name.component';
import { AgainstGameTitleComponent } from './againstgame/title.component';
import { S11PlayerGameRoundStatisticsComponent } from './statistics/gameround.component';
import { S11PlayerViewPeriodStatisticsComponent } from './statistics/viewperiod.component';
import { PointsMapper } from '../lib/points/mapper';
import { StatisticsRepository } from '../lib/statistics/repository';

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
    AgainstGameTitleComponent,
    AssembleComponent,
    AssembleLineComponent,
    ChooseS11PlayersComponent,
    ChooseFormationComponent,
    ConfirmS11PlayerChoiceModalComponent,
    NewComponent,
    HomeComponent,
    InviteComponent,
    JoinComponent,
    PoolUsersComponent,
    PreNewComponent,
    RulesComponent,
    RemoveApprovalModalComponent,
    S11PlayerComponent,
    S11PlayerInfoModalComponent,
    S11PlayerGameRoundStatisticsComponent,
    S11PlayerViewPeriodStatisticsComponent,
    ScoutingComponent,
    TeamNameComponent
  ],
  providers: [
  ]
})
export class PoolModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faListOl, faChevronLeft, faChevronRight, faEnvelope, faClipboardCheck, faUsers, faTimesCircle, faCheckCircle, faTrashAlt
      , faInfoCircle, faSearch, faPlusCircle, faPencilAlt/*faMoneyBillAlt, faCircle, faTimesCircle, faListUl, faCogs, faMinus, faTh,
      faCompressAlt, faExpandAlt, faFileExport, faFileExcel, faPrint, faSort, faRandom, faSquare, faCheckSquare,
      , faMedal, , faQrcode, faCopy, faDotCircle, faSync*/
    );
    /*library.addIcons(
      faProductHunt
    );*/
  }
}


