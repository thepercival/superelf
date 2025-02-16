import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { IAlert } from '../../shared/commonmodule/alert';
import { User } from '../../lib/user';
import { PasswordValidation } from '../password-validation';
import { AuthComponent } from '../component';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { UserTitleComponent } from '../title/title.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { faKey } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'app-passwordchange',
  imports: [UserTitleComponent,FontAwesomeModule,NgbAlertModule],
  templateUrl: './passwordchange.component.html',
  styleUrls: ['./passwordchange.component.css']
})
export class PasswordchangeComponent extends AuthComponent implements OnInit {
  faKey = faKey;
  passwordChanged = false;
  form: UntypedFormGroup;

  validations: any = {
    minlengthcode: 100000,
    maxlengthcode: 999999,
    minlengthpassword: User.MIN_LENGTH_PASSWORD,
    maxlengthpassword: User.MAX_LENGTH_PASSWORD
  };
  private emailaddress: string | undefined;

  constructor(
    private route: ActivatedRoute,
    authService: AuthService,
    eventsManager: GlobalEventsManager,
    fb: UntypedFormBuilder
  ) {
    super(authService, eventsManager);
    this.form = fb.group({
      code: ['', Validators.compose([
        Validators.required,
        Validators.min(this.validations.minlengthcode),
        Validators.max(this.validations.maxlengthcode)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthpassword),
        Validators.maxLength(this.validations.maxlengthpassword)
      ])],
      passwordRepeat: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthpassword),
        Validators.maxLength(this.validations.maxlengthpassword)
      ])],
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const emailaddress = params.get('emailaddress');
      this.emailaddress = emailaddress !== null ? emailaddress : undefined;
    });
    this.processing.set(false);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  changePassword(): boolean {
    this.processing.set(true);
    this.setAlert('info', 'het wachtwoord wordt gewijzigd');

    const code = this.form.controls.code.value;
    const password = this.form.controls.password.value;

    if (!this.emailaddress) {
      return false;
    }
    // this.activationmessage = undefined;
    this.authService.passwordChange(this.emailaddress, password, code).subscribe({
      next: (p: boolean) => {
        this.passwordChanged = true;
        this.resetAlert();
      },
      error: (e) => {
        this.setAlert('danger', 'het wijzigen van het wachtwoord is niet gelukt: ' + e);
        this.processing.set(false);
      },
      complete: () => this.processing.set(false)
    });
    return false;
  }
}
