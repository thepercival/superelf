import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PreNewComponent } from './prenew/prenew.component';
import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { RulesComponent } from './rules/rules.component';
import { JoinComponent } from './join/join.component';
import { AuthUserGuardService } from '../lib/auth/guard/userguard.service';
import { PoolUsersComponent } from './poolusers/poolusers.component';
import { InviteComponent } from './invite/invite.component';
import { S11PlayerComponent } from './player/info.component';
import { ScoutedPlayerListComponent } from './scoutedPlayer/list.component';
import { ScoutedPlayerAddComponent } from './scoutedPlayer/add.component';
import { FormationChooseComponent } from './formation/choose.component';
import { FormationPlaceEditComponent } from './formation/place/edit.component';
import { FormationAssembleComponent } from './formation/assemble.component';
import { WorldCupComponent } from './worldcup/worldcup.component';
import { PoolUserComponent } from './poolusers/pooluser.component';
import { PoolChatComponent } from './chat/chat.component';
import { PoolTogetherGameComponent } from './game/pool/togethergame.component';
import { PoolCompetitionComponent } from './competition/competition.component';
import { PoolCupComponent } from './cup/structure.component';
import { PoolPouleComponent } from './poule/poule.component';
import { SourceGameComponent } from './game/source.component';
import { TrophiesComponent } from './trophies/trophies.component';
import { FormationReplaceComponent } from './formation/replace.component';
import { FormationPlaceReplaceComponent } from './formation/place/replace.component';
import { FormationTransferComponent } from './formation/transfer.component';
import { FormationPlaceTransferComponent } from './formation/place/transfer.component';
import { FormationSubstituteComponent } from './formation/substitute.component';
import { FormationActionOverviewComponent } from './formation/actionoverview.component';

const routes: Routes = [
  { path: 'new', component: NewComponent, canActivate: [AuthUserGuardService] },
  { path: 'prenew', component: PreNewComponent },

  { path: ':id', component: HomeComponent },
  { path: 'chat/:id/:leagueName/:pouleId', component: PoolChatComponent },
  { path: 'competition/:id', component: PoolCompetitionComponent, canActivate: [AuthUserGuardService] },
  { path: 'cup/:id', component: PoolCupComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/assemble/:id', component: FormationAssembleComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/choose/:id', component: FormationChooseComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/place/edit/:id/:placeId', component: FormationPlaceEditComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/replacements/:id', component: FormationReplaceComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/transfers/:id', component: FormationTransferComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/substitutions/:id', component: FormationSubstituteComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/actions/:id', component: FormationActionOverviewComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/place/replace/:id/:placeId', component: FormationPlaceReplaceComponent, canActivate: [AuthUserGuardService] },  
  { path: 'formation/place/transfer/:id/:lineNr/:placeNr', component: FormationPlaceTransferComponent, canActivate: [AuthUserGuardService] },    
  { path: 'invite/:id', component: InviteComponent, canActivate: [AuthUserGuardService] },
  { path: 'join/:id/:key', component: JoinComponent },
  { path: 'player/:id/:playerId/:gameRound', component: S11PlayerComponent },
  { path: 'poule/:id/:leagueName/:pouleId', component: PoolPouleComponent },
  { path: 'rules/:id', component: RulesComponent },
  // { path: 'schedule/:id/:gameRound', component: ScheduleComponent },
  { path: 'scouting/list/:id', component: ScoutedPlayerListComponent, canActivate: [AuthUserGuardService] },
  { path: 'scouting/search/:id', component: ScoutedPlayerAddComponent, canActivate: [AuthUserGuardService] },
  { path: 'sourcegame/:id/:gameRound/:gameId', component: SourceGameComponent },
  { path: 'togethergame/:id/:gameRound/:gameId', component: PoolTogetherGameComponent },
  { path: 'trophies/:id', component: TrophiesComponent },  
  { path: 'users/:id', component: PoolUsersComponent, canActivate: [AuthUserGuardService] },
  { path: 'user/:id/:poolUserId/:gameRound', component: PoolUserComponent, canActivate: [AuthUserGuardService] },  
  { path: 'worldcup/:id', component: WorldCupComponent },
  /*{ path: 'chooseplayers/:id', component: ChooseS11PlayersComponent, canActivate: [AuthUserGuardService] },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class RoutingModule { }
