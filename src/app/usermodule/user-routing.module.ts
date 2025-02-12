import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { ValidateComponent } from './validate/validate.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PasswordchangeComponent } from './passwordchange/passwordchange.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthUserGuardService } from '../lib/auth/guard/userguard.service';

// import { ActivateComponent }  from './user/activate.component';
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'validate/:emailaddress/:key', component: ValidateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'passwordreset', component: PasswordresetComponent },
  { path: 'passwordchange', component: PasswordchangeComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthUserGuardService] }
];

@NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class UserRoutingModule { }
