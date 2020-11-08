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
  faInfoCircle
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
  PlanningConfigService,
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
  FormationLineMapper,
  FormationMapper
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
import { PoolScoreUnitMapper } from '../lib/pool/scoreUnit/mapper';
import { PoolPeriodMapper } from '../lib/pool/period/mapper';
import { RulesComponent } from './rules/rules.component';
import { JoinComponent } from './join/join.component';
import { PoolUserMapper } from '../lib/pool/user/mapper';
import { PoolCompetitorMapper } from '../lib/pool/competitor/mapper';
import { PoolUsersComponent } from './poolusers/poolusers.component';
import { PoolUserRepository } from '../lib/pool/user/repository';
import { PoolUserRemoveApprovalModalComponent } from './poolusers/removeapprovalmodal.component';
import { InviteComponent } from './invite/invite.component';
import { ScoutingComponent } from './scouting/scouting.component';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonSharedModule,
    PoolSharedModule,
    ClipboardModule
  ],
  declarations: [
    PreNewComponent,
    NewComponent,
    HomeComponent,
    InviteComponent,
    JoinComponent,
    PoolUsersComponent,
    RulesComponent,
    ScoutingComponent
  ],
  entryComponents: [PoolUserRemoveApprovalModalComponent],
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
    PlanningConfigService,
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
    PoolPeriodMapper,
    PoolScoreUnitMapper,
    PoolUserRepository,
    PoolUserMapper,
    PoolCompetitorMapper,
    ScoreUnitMapper
  ]
})
export class PoolModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faListOl, faChevronRight, faEnvelope, faClipboardCheck, faUsers, faTimesCircle, faCheckCircle, faTrashAlt
      , faInfoCircle/*faMoneyBillAlt, faCircle, faTimesCircle, faListUl, faCogs, faMinus, faTh,
      faCompressAlt, faExpandAlt, faFileExport, faFileExcel, faPrint, faSort, faRandom, faSquare, faCheckSquare,
      , faMedal, , faQrcode, faCopy, faDotCircle, faSync*/
    );
    /*library.addIcons(
      faProductHunt
    );*/
  }
}


