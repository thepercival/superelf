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
  faRightLeft,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import { CommonSharedModule } from '../../src/app/shared/commonmodule/common.module';
import { PreNewComponent } from '../../src/app/poolmodule/prenew/prenew.component';
import { RoutingModule } from '../../src/app/poolmodule/pool.routes';
import { PoolSharedModule } from '../shared/poolmodule/pool.module';
import { NewComponent } from '../../src/app/poolmodule/new/new.component';
import { RulesComponent } from '../../src/app/poolmodule/rules/rules.component';
import { JoinComponent } from '../../src/app/poolmodule/join/join.component';
import { PoolUsersComponent } from '../../src/app/poolmodule/poolusers/poolusers.component';
import { InviteComponent } from '../../src/app/poolmodule/invite/invite.component';
import { ScoutedPlayerListComponent } from '../../src/app/poolmodule/scoutedPlayer/list.component';
import { S11PlayerComponent } from '../../src/app/poolmodule/player/info.modal.component';
import { S11PlayerAddRemoveModalComponent } from '../../src/app/poolmodule/player/addremovemodal.component';
import { TeamNameComponent } from '../../src/app/poolmodule/team/name.component';
import { S11PlayerGameRoundStatisticsComponent } from '../../src/app/poolmodule/player/statistics/gameround.component';
import { S11PlayerViewPeriodStatisticsComponent } from '../viewperiod.component';
import { PlayerBasicsComponent } from '../../src/app/poolmodule/player/basics.component';
import { ScoutedPlayerAddComponent } from '../../src/app/poolmodule/scoutedPlayer/add.component';
import { PoolUserRemoveModalComponent } from '../../src/app/poolmodule/poolusers/removemodal.component';
import { FormationChooseComponent } from '../../src/app/poolmodule/formation/choose.component';
import { FormationPlaceEditComponent } from '../../src/app/poolmodule/formation/place/edit.component';
import { FormationLineViewComponent } from '../../src/app/poolmodule/formation/line/view.component';
import { FormationAssembleComponent } from '../../src/app/poolmodule/formation/assemble.component';
import { WorldCupComponent } from '../../src/app/poolmodule/worldcup/worldcup.component';
import { PoolUserComponent } from '../../src/app/poolmodule/poolusers/pooluser.component';
import { AgainstGameTitleComponent } from '../../src/app/poolmodule/game/source/title.component';
import { SourceGameComponent } from '../../src/app/poolmodule/game/source.component';
import { GameRoundScrollerComponent } from '../../src/app/poolmodule/gameRound/gameRoundScroller.component';
import { GameScrollerComponent } from '../../src/app/poolmodule/game/source/gameScroller.component';
import { PoolChatComponent } from '../../src/app/poolmodule/chat/chat.component';
import { PoolCompetitionComponent } from '../../src/app/poolmodule/competition/competition.component';
import { PoolCupComponent } from '../../src/app/poolmodule/cup/structure.component';
import { PoolCupRoundComponent } from '../../src/app/poolmodule/cup/round.component';
import { TogetherRankingComponent } from '../../src/app/poolmodule/competition/togetherranking.component';
import { AchievementsComponent } from '../../src/app/poolmodule/achievements/achievements.component';
import { FormationReplaceComponent } from '../../src/app/poolmodule/formation/replace.component';
import { FormationTransferComponent } from '../../src/app/poolmodule/formation/transfer.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormationLineReplacementsComponent } from '../../src/app/poolmodule/formation/line/replacements.component';
import { FormationLineTransfersComponent } from '../../src/app/poolmodule/formation/line/transfers.component';
import { FormationPlaceReplaceComponent } from '../../src/app/poolmodule/formation/place/replace.component';
import { FormationPlaceTransferComponent } from '../../src/app/poolmodule/formation/place/transfer.component';
import { FormationSubstituteComponent } from '../../src/app/poolmodule/formation/substitute.component';
import { FormationLineSubstitutionsComponent } from '../../src/app/poolmodule/formation/line/substitutions.component';
import { FormationActionOverviewComponent } from '../../src/app/poolmodule/formation/actionoverview.modal.component';
import { PoolPouleAgainstGamesComponent } from '../../src/app/poolmodule/poule/againstgames.component';
import { PouleTitleComponent } from '../../src/app/poolmodule/poule/title.component';
import { PoolAllInOneGameScheduleComponent } from '../../src/app/poolmodule/allinonegame/allinonegame.component';
import { UnviewedAchievementsModalComponent } from '../../src/app/poolmodule/achievements/unviewed-modal.component';
import { NgParticlesModule } from 'ng-particles';
import { ChooseBadgeCategoryModalComponent } from '../../src/app/poolmodule/badge/choosecategory-modal.component';
import { UserBadgesModalComponent } from '../../src/app/poolmodule/achievements/userbadges-modal.component';

// @NgModule({
//     imports: [
//         // CommonModule,
//         // RoutingModule,
//         // ReactiveFormsModule,
//         // FontAwesomeModule,
//         // PoolSharedModule,
//         // CommonSharedModule,
//         // ClipboardModule,
//         // NgbPaginationModule,
//         // NgParticlesModule,
//         // AchievementsComponent,
//         // AgainstGameTitleComponent,
//         // ChooseBadgeCategoryModalComponent,
//         // FormationActionOverviewComponent,
//         // FormationAssembleComponent,
//         // FormationChooseComponent,
//         // FormationLineReplacementsComponent,
//         // FormationLineTransfersComponent,
//         // FormationLineSubstitutionsComponent,
//         // FormationLineViewComponent,
//         // FormationPlaceEditComponent,
//         // FormationPlaceReplaceComponent,
//         // FormationPlaceTransferComponent,
//         // FormationReplaceComponent,
//         // FormationSubstituteComponent,
//         // FormationTransferComponent,
//         // GameRoundScrollerComponent,
//         // GameScrollerComponent,
//         // InviteComponent,
//         // JoinComponent,
//         // NewComponent,
//         // PlayerBasicsComponent,
//         // PoolAllInOneGameScheduleComponent,
//         // PoolChatComponent,
//         // PoolCompetitionComponent,
//         // PoolCupComponent,
//         // PoolCupRoundComponent,
//         // PoolPouleAgainstGamesComponent,
//         // PoolUserComponent,
//         // PoolUserRemoveModalComponent,
//         // PoolUsersComponent,
//         // PouleTitleComponent,
//         // PreNewComponent,
//         // RulesComponent,
//         // S11PlayerComponent,
//         // S11PlayerAddRemoveModalComponent,
//         // S11PlayerGameRoundStatisticsComponent,
//         // S11PlayerViewPeriodStatisticsComponent,
//         // ScoutedPlayerListComponent,
//         // ScoutedPlayerAddComponent,
//         // SourceGameComponent,
//         // TeamNameComponent,
//         // TogetherRankingComponent,
//         // UnviewedAchievementsModalComponent,
//         // UserBadgesModalComponent,
//         // WorldCupComponent
//     ],
//     providers: []
// })
// export class PoolModule {
//   constructor(library: FaIconLibrary) {
//     library.addIcons(
//       faListOl, faChevronLeft, faChevronRight, faEnvelope, faClipboardCheck, faUsers, faTimesCircle, faCheckCircle, faTrashAlt
//       , faInfoCircle, faSearch, faPlusCircle, faPencilAlt, faUserSecret, faMessage, faPaperPlane, faFilter,
//       faRightLeft, faSignOutAlt
//     );
//     /*library.addIcons(
//       faProductHunt
//     );*/
//   }
// }


