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

import { CommonSharedModule } from '../shared/commonmodule/common.module';
import { HomeComponent } from './home/home.component';
import { PreNewComponent } from './prenew/prenew.component';
import { RoutingModule } from './pool-routing.module';
import { PoolSharedModule } from '../shared/poolmodule/pool.module';
import { NewComponent } from './new/new.component';
import { RulesComponent } from './rules/rules.component';
import { JoinComponent } from './join/join.component';
import { PoolUsersComponent } from './poolusers/poolusers.component';
import { InviteComponent } from './invite/invite.component';
import { ScoutedPlayerListComponent } from './scoutedPlayer/list.component';
import { S11PlayerComponent } from './player/info.component';
import { SourceGameComponent } from './againstgame/source.component';
import { S11PlayerAddRemoveModalComponent } from './player/addremovemodal.component';
import { TeamNameComponent } from './team/name.component';
import { AgainstGameTitleComponent } from './againstgame/title.component';
import { S11PlayerGameRoundStatisticsComponent } from './statistics/gameround.component';
import { S11PlayerViewPeriodStatisticsComponent } from './statistics/viewperiod.component';
import { PlayerBasicsComponent } from './player/basics.component';
import { ScoutedPlayerAddComponent } from './scoutedPlayer/add.component';
import { PoolUserRemoveModalComponent } from './poolusers/removemodal.component';
import { AgainstGameDetailsComponent } from './againstgame/details.component';
import { FormationChooseComponent } from './formation/choose.component';
import { FormationPlaceEditComponent } from './formation/place/edit.component';
import { FormationLineAssembleComponent } from './formation/line/assemble.component';
import { FormationAssembleComponent } from './formation/assemble.component';
import { S11PlayerChooseComponent } from './player/choose.component';
import { PoolCompetitionComponent } from './leagues/competition.component';
import { TogetherRankingComponent } from './leagues/togetherranking.component';
import { WorldCupComponent } from './worldcup/worldcup.component';

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
    AgainstGameDetailsComponent,
    S11PlayerChooseComponent,
    FormationAssembleComponent,
    FormationChooseComponent,
    FormationLineAssembleComponent,
    FormationPlaceEditComponent,
    S11PlayerAddRemoveModalComponent,
    NewComponent,
    HomeComponent,
    InviteComponent,
    JoinComponent,
    PoolUsersComponent,
    PreNewComponent,
    RulesComponent,
    PoolCompetitionComponent,
    PoolUserRemoveModalComponent,
    S11PlayerComponent,
    SourceGameComponent,
    PlayerBasicsComponent,
    S11PlayerGameRoundStatisticsComponent,
    S11PlayerViewPeriodStatisticsComponent,
    ScoutedPlayerListComponent,
    ScoutedPlayerAddComponent,
    TeamNameComponent,
    TogetherRankingComponent,
    WorldCupComponent
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


