import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PreNewComponent } from './prenew/prenew.component';
import { NewComponent } from './new/new.component';
import { RulesComponent } from './rules/rules.component';
import { JoinComponent } from './join/join.component';
import { AuthUserGuardService } from '../lib/auth/guard/userguard.service';
import { PoolUsersComponent } from './poolusers/poolusers.component';
import { InviteComponent } from './invite/invite.component';
import { ScoutedPlayerListComponent } from './scoutedPlayer/list.component';
import { ScoutedPlayerAddComponent } from './scoutedPlayer/add.component';
import { FormationChooseComponent } from './formation/choose.component';
import { FormationPlaceEditComponent } from './formation/place/edit.component';
import { FormationAssembleComponent } from './formation/assemble.component';
import { WorldCupComponent } from './worldcup/worldcup.component';
import { PoolUserComponent } from './poolusers/pooluser.component';
import { PoolChatComponent } from './chat/chat.component';
import { PoolCompetitionComponent } from './competition/competition.component';
import { PoolCupComponent } from './cup/structure.component';
import { SourceGameComponent } from './game/source.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { FormationReplaceComponent } from './formation/replace.component';
import { FormationPlaceReplaceComponent } from './formation/place/replace.component';
import { FormationTransferComponent } from './formation/transfer.component';
import { FormationPlaceTransferComponent } from './formation/place/transfer.component';
import { FormationSubstituteComponent } from './formation/substitute.component';
import { PoolPouleAgainstGamesComponent } from './poule/againstgames.component';
import { PoolAllInOneGameScheduleComponent } from './allinonegame/allinonegame.component';

export const poolRoutes: Routes = [
  {
    path: "pool/new",
    component: NewComponent,
    canActivate: [AuthUserGuardService],
  },
  { path: "pool/prenew", component: PreNewComponent },
  { path: "pool/achievements/:id", component: AchievementsComponent },
  {
    path: "pool/allinonegame/:id",
    component: PoolAllInOneGameScheduleComponent,
  },
  { path: "pool/chat/:id/:leagueName/:pouleId", component: PoolChatComponent },
  {
    path: "pool/competition/:id",
    component: PoolCompetitionComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/cup/:id",
    component: PoolCupComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/formation/assemble/:id",
    component: FormationAssembleComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/formation/choose/:id",
    component: FormationChooseComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/formation/place/edit/:id/:placeId",
    component: FormationPlaceEditComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/formation/replacements/:id",
    component: FormationReplaceComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/formation/transfers/:id",
    component: FormationTransferComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/formation/substitutions/:id",
    component: FormationSubstituteComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/formation/place/replace/:id/:placeId",
    component: FormationPlaceReplaceComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/formation/place/transfer/:id/:lineNr/:placeNr",
    component: FormationPlaceTransferComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/invite/:id",
    component: InviteComponent,
    canActivate: [AuthUserGuardService],
  },
  { path: "pool/join/:id/:key", component: JoinComponent },
  // { path: "pool/player/:id/:playerId/:gameRound", component: S11PlayerComponent },
  {
    path: "pool/poule-againstgames/:id/:leagueName/:poolPouleId",
    component: PoolPouleAgainstGamesComponent,
  },
  { path: "pool/rules/:id", component: RulesComponent },
  // { path: 'schedule/:id/:gameRound', component: ScheduleComponent },
  {
    path: "pool/scouting/list/:id",
    component: ScoutedPlayerListComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/scouting/search/:id",
    component: ScoutedPlayerAddComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/sourcegame/:id/:gameRound/:gameId",
    component: SourceGameComponent,
  },

  {
    path: "pool/users/:id",
    component: PoolUsersComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/user/:id/:poolUserId/:gameRoundNr",
    component: PoolUserComponent,
    canActivate: [AuthUserGuardService],
  },
  {
    path: "pool/worldcup/:seasonId/:originPoolId",
    component: WorldCupComponent,
  },
  /*{ path: 'chooseplayers/:id', component: ChooseS11PlayersComponent, canActivate: [AuthUserGuardService] },*/
  { path: "pool/:id", redirectTo: "pool/competition/:id", pathMatch: "full" },
];

// @NgModule({
//   imports: [RouterModule.forChild(routes), ReactiveFormsModule],
//   exports: [RouterModule]
// })
// export class RoutingModule { }
