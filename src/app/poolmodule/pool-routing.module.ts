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
import { PoolCompetitionComponent } from './leagues/competition.component';
import { WorldCupComponent } from './worldcup/worldcup.component';
import { PoolUserComponent } from './poolusers/pooluser.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { PoolTogetherGameComponent } from './game/pool/together/togethergame.component';
import { SourceGameComponent } from './game/source/source.component';
import { PoolAgainstGameComponent } from './game/pool/against/againstgame.component';

const routes: Routes = [
  { path: 'new', component: NewComponent, canActivate: [AuthUserGuardService] },
  { path: 'prenew', component: PreNewComponent },

  { path: ':id', component: HomeComponent },
  { path: 'competition/:id', component: PoolCompetitionComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/assemble/:id', component: FormationAssembleComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/choose/:id', component: FormationChooseComponent, canActivate: [AuthUserGuardService] },
  { path: 'formation/place/edit/:id/:placeId', component: FormationPlaceEditComponent, canActivate: [AuthUserGuardService] },
  { path: 'invite/:id', component: InviteComponent, canActivate: [AuthUserGuardService] },
  { path: 'join/:id/:key', component: JoinComponent },
  { path: 'player/:id/:playerId/:gameRound', component: S11PlayerComponent },
  { path: 'rules/:id', component: RulesComponent },
  { path: 'schedule/:id/:gameRound', component: ScheduleComponent },
  { path: 'scouting/list/:id', component: ScoutedPlayerListComponent, canActivate: [AuthUserGuardService] },
  { path: 'scouting/search/:id', component: ScoutedPlayerAddComponent, canActivate: [AuthUserGuardService] },
  { path: 'sourcegame/:id/:gameRound/:gameId', component: SourceGameComponent },
  { path: 'togethergame/:id/:gameRound/:gameId', component: PoolTogetherGameComponent },
  { path: 'againstgame/:id/:leagueName', component: PoolAgainstGameComponent },
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
