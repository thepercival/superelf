import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { ValidateComponent } from './validate/validate.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PasswordchangeComponent } from './passwordchange/passwordchange.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthUserGuardService } from '../lib/auth/guard/userguard.service';

// import { ActivateComponent }  from './user/activate.component';
export const userRoutes: Routes = [
  { path: "user/register", component: RegisterComponent },
  { path: "user/validate/:emailaddress/:key", component: ValidateComponent },
  { path: "user/login", component: LoginComponent },
  { path: "user/passwordreset", component: PasswordresetComponent },
  { path: "user/passwordchange", component: PasswordchangeComponent },
  { path: "user/logout", component: LogoutComponent },
  {
    path: "user/profile/:id",
    component: ProfileComponent,
    canActivate: [AuthUserGuardService],
  },
];
