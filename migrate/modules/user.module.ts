import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbAlertConfig, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from '../../src/app/usermodule/login/login.component';
import { LogoutComponent } from '../../src/app/usermodule/logout/logout.component';
import { PasswordchangeComponent } from '../../src/app/usermodule/passwordchange/passwordchange.component';
import { PasswordresetComponent } from '../../src/app/usermodule/passwordreset/passwordreset.component';
import { RegisterComponent } from '../../src/app/usermodule/register/register.component';
import { ValidateComponent } from '../../src/app/usermodule/validate/validate.component';
import { UserRoutingModule } from '../../src/app/usermodule/user.routes';
import { ProfileComponent } from '../../src/app/usermodule/profile/profile.component';
import { UserRepository } from '../../src/app/lib/user/repository';
import { UserTitleComponent } from '../../src/app/usermodule/title/title.component';
import { faKey } from '@fortawesome/free-solid-svg-icons';

// @NgModule({
//     // imports: [
//     //     CommonModule,
//     //     ReactiveFormsModule,
//     //     UserRoutingModule,
//     //     NgbAlertModule,
//     //     FontAwesomeModule,
//     //     LoginComponent,
//     //     LogoutComponent,
//     //     RegisterComponent,
//     //     ValidateComponent,
//     //     PasswordresetComponent,
//     //     PasswordchangeComponent,
//     //     ProfileComponent,
//     //     UserTitleComponent
//     // ],
//     // providers: [UserRepository],
//     // exports: [
//     //     UserTitleComponent
//     // ]
// })
// export class UserModule {
//   // constructor(library: FaIconLibrary, alertConfig: NgbAlertConfig) {
//   //   library.addIcons(faKey);
//   //   alertConfig.dismissible = false;
//   // }
// }
