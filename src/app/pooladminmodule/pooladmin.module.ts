import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faCheckCircle,
  faCopy,
  faDotCircle,
  faMoneyBillAlt,
  faFileExcel,
  faFileExport,
  faPrint,
  faQrcode,
  faRandom,
  faSort,
  faTh,
  faTimesCircle,
  faTrashAlt,
  faCompressAlt,
  faExpandAlt,
  faShareAlt,
  faEye,
  faClipboardCheck,
  faListOl,
} from '@fortawesome/free-solid-svg-icons';
import { ClipboardModule } from 'ngx-clipboard';
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
  AssociationMapper
} from 'ngx-sport';

import { CSSService } from '../shared/commonmodule/cssservice';
import { CommonSharedModule } from '../shared/commonmodule/common.module';
import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { RoutingModule } from './pooladmin-routing.module';
import { CompetitorRepository } from '../lib/ngx-sport/competitor/repository';
import { PoolModule } from '../poolmodule/pool.module';
import { PoolInvitationRepository } from '../lib/pool/invitation/repository';
import { PoolInvitationMapper } from '../lib/pool/invitation/mapper';
import { CompetitorMapper } from '../lib/competitor/mapper';

@NgModule({
  imports: [
    ClipboardModule,
    CommonModule,
    RoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonSharedModule, PoolModule
  ],
  declarations: [
    NewComponent,
    HomeComponent,
  ],
  entryComponents: [],
  providers: [
    AssociationMapper,
    CompetitorMapper,
    CompetitionMapper,
    CompetitorRepository,
    CSSService,
    FieldMapper,
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
    PoolInvitationRepository,
    PoolInvitationMapper,
  ]
})
export class PoolAdminModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      /* homescreen */ faMoneyBillAlt, faCheckCircle, faTimesCircle, faShareAlt, faEye, faFileExport, faCopy, faTrashAlt
      , faQrcode, faPrint, faFileExcel,
      /* sport select*/ faDotCircle,
      /* competitors*/ faSquare, faCheckSquare, faRandom, faSort,
      /* structure*/ faCompressAlt, faExpandAlt, faTh,
      /* delen */ faClipboardCheck,
      /* standen */ faListOl
      /*faCircle, faListUl, faCogs, faMinus, faInfoCircle, faMedal, faUsers, faSync*/
    );
    library.addIcons(
      faProductHunt
    );
  }
}


