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
import { ScoutingComponent } from './scouting/scouting.component';
import { ChoosePersonsComponent } from './choosepersons/choosepersons.component';
import { AssembleComponent } from './assemble/assemble.component';

const routes: Routes = [
  { path: 'prenew', component: PreNewComponent },
  { path: 'new', component: NewComponent, canActivate: [AuthUserGuardService] },
  { path: ':id', component: HomeComponent },
  { path: 'invite/:id', component: InviteComponent, canActivate: [AuthUserGuardService] },
  { path: 'join/:id/:key', component: JoinComponent, canActivate: [AuthUserGuardService] },
  { path: 'users/:id', component: PoolUsersComponent, canActivate: [AuthUserGuardService] },
  { path: 'scouting/:id', component: ScoutingComponent, canActivate: [AuthUserGuardService] },
  { path: 'choosepersons/:id', component: ChoosePersonsComponent, canActivate: [AuthUserGuardService] },
  { path: 'assemble/:id', component: AssembleComponent, canActivate: [AuthUserGuardService] },
  { path: 'rules/:id', component: RulesComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class RoutingModule { }
