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
  faPencilAlt,
  faUserSecret,
  faMessage,
  faPaperPlane,
  faFilter,
  faRightLeft
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
import { S11PlayerAddRemoveModalComponent } from './player/addremovemodal.component';
import { TeamNameComponent } from './team/name.component';
import { S11PlayerGameRoundStatisticsComponent } from './statistics/gameround.component';
import { S11PlayerViewPeriodStatisticsComponent } from './statistics/viewperiod.component';
import { PlayerBasicsComponent } from './player/basics.component';
import { ScoutedPlayerAddComponent } from './scoutedPlayer/add.component';
import { PoolUserRemoveModalComponent } from './poolusers/removemodal.component';
import { FormationChooseComponent } from './formation/choose.component';
import { FormationPlaceEditComponent } from './formation/place/edit.component';
import { FormationLineAssembleComponent } from './formation/line/assemble.component';
import { FormationLineViewComponent } from './formation/line/view.component';
import { FormationAssembleComponent } from './formation/assemble.component';
import { S11PlayerChooseComponent } from './player/choose.component';
import { WorldCupComponent } from './worldcup/worldcup.component';
import { PoolUserComponent } from './poolusers/pooluser.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AgainstGameTitleComponent } from './game/source/title.component';
import { SourceGameComponent } from './game/source.component';
import { GameRoundScrollerComponent } from './gameRound/gameRoundScroller.component';
import { GameScrollerComponent } from './game/source/gameScroller.component';
import { PoolPouleComponent } from './poule/poule.component';
import { PoolTogetherGameComponent } from './game/pool/togethergame.component';
import { PoolChatComponent } from './chat/chat.component';
import { PouleTitleComponent } from './poule/title.component';
import { PoolCompetitionComponent } from './competition/competition.component';
import { PoolCupComponent } from './cup/structure.component';
import { PoolCupRoundComponent } from './cup/round.component';
import { TogetherRankingComponent } from './competition/togetherranking.component';
import { TrophiesComponent } from './trophies/trophies.component';
import { FormationReplaceComponent } from './formation/replace.component';
import { FormationTransferComponent } from './formation/transfer.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormationLineReplacementsComponent } from './formation/line/replacements.component';
import { FormationLineTransfersComponent } from './formation/line/transfers.component';
import { FormationPlaceReplaceComponent } from './formation/place/replace.component';
import { FormationPlaceTransferComponent } from './formation/place/transfer.component';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    PoolSharedModule,
    CommonSharedModule,
    ClipboardModule,
    NgbPaginationModule
  ],
  declarations: [
    AgainstGameTitleComponent,
    FormationAssembleComponent,
    FormationChooseComponent,
    FormationLineAssembleComponent,
    FormationLineReplacementsComponent,
    FormationLineTransfersComponent,
    FormationLineViewComponent,
    FormationPlaceEditComponent,
    FormationPlaceReplaceComponent,
    FormationPlaceTransferComponent,
    FormationReplaceComponent,
    FormationTransferComponent,
    GameRoundScrollerComponent,
    GameScrollerComponent,
    HomeComponent,
    InviteComponent,
    JoinComponent,
    NewComponent,
    PlayerBasicsComponent,
    PoolChatComponent,
    PoolCompetitionComponent,
    PoolCupComponent,
    PoolCupRoundComponent,
    PoolPouleComponent,
    PoolTogetherGameComponent,
    PoolUserComponent,
    PoolUserRemoveModalComponent,
    PoolUsersComponent,
    PouleTitleComponent,
    PreNewComponent,
    RulesComponent,
    S11PlayerComponent,
    S11PlayerChooseComponent,
    S11PlayerAddRemoveModalComponent,
    S11PlayerGameRoundStatisticsComponent,
    S11PlayerViewPeriodStatisticsComponent,
    ScheduleComponent,
    ScoutedPlayerListComponent,
    ScoutedPlayerAddComponent,
    SourceGameComponent,
    TeamNameComponent,
    TogetherRankingComponent,
    TrophiesComponent,
    WorldCupComponent
  ],
  providers: [
  ]
})
export class PoolModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faListOl, faChevronLeft, faChevronRight, faEnvelope, faClipboardCheck, faUsers, faTimesCircle, faCheckCircle, faTrashAlt
      , faInfoCircle, faSearch, faPlusCircle, faPencilAlt, faUserSecret, faMessage, faPaperPlane, faFilter,
      faRightLeft
    );
    /*library.addIcons(
      faProductHunt
    );*/
  }
}


