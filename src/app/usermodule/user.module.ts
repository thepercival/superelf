import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbAlertConfig, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PasswordchangeComponent } from './passwordchange/passwordchange.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { RegisterComponent } from './register/register.component';
import { ValidateComponent } from './validate/validate.component';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { UserRepository } from '../lib/user/repository';
import { UserTitleComponent } from './title/title.component';
import { faKey } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    NgbAlertModule,
    FontAwesomeModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ValidateComponent,
    PasswordresetComponent,
    PasswordchangeComponent,
    ProfileComponent,
    UserTitleComponent
  ],
  providers: [UserRepository],
  exports: [
    UserTitleComponent
  ]
})
export class UserModule {
  constructor(library: FaIconLibrary, alertConfig: NgbAlertConfig) {
    library.addIcons(faKey);
    alertConfig.dismissible = false;
  }
}
