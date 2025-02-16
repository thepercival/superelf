import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { IAlert } from '../../shared/commonmodule/alert';
import { User } from '../../lib/user';
import { AuthComponent } from '../component';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { UserTitleComponent } from '../title/title.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { faKey } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'app-passwordreset',
  imports: [UserTitleComponent,FontAwesomeModule,NgbAlertModule],
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent extends AuthComponent implements OnInit {
  faKey = faKey;
  codeSend = false;
  form: UntypedFormGroup;

  validations: any = {
    minlengthemailaddress: User.MIN_LENGTH_EMAIL,
    maxlengthemailaddress: User.MAX_LENGTH_EMAIL
  };

  constructor(
    authService: AuthService,
    eventsManager: GlobalEventsManager,
    fb: UntypedFormBuilder
  ) {
    super(authService, eventsManager);
    this.form = fb.group({
      emailaddress: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthemailaddress),
        Validators.maxLength(this.validations.maxlengthemailaddress)
      ])]
    });
  }

  ngOnInit() {
    this.processing.set(false);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  sendCode(): boolean {
    this.processing.set(true);
    this.setAlert('info', 'de code wordt verstuurd');

    const emailaddress = this.form.controls.emailaddress.value;

    // this.activationmessage = undefined;
    this.authService.passwordReset(emailaddress).subscribe({
      next: (p: boolean) => {
        this.codeSend = true;
        this.resetAlert();
      },
      error: (e) => {
        this.setAlert('danger', 'het verzenden van de code is niet gelukt: ' + e);
        this.processing.set(false);
      },
      complete: () => this.processing.set(false)
    });
    return false;
  }

}
