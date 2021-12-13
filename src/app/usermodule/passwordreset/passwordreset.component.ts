import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { IAlert } from '../../shared/commonmodule/alert';
import { User } from '../../lib/user';
import { AuthComponent } from '../component';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent extends AuthComponent implements OnInit {
  codeSend = false;
  form: FormGroup;

  validations: any = {
    minlengthemailaddress: User.MIN_LENGTH_EMAIL,
    maxlengthemailaddress: User.MAX_LENGTH_EMAIL
  };

  constructor(
    authService: AuthService,
    fb: FormBuilder
  ) {
    super(authService);
    this.form = fb.group({
      emailaddress: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthemailaddress),
        Validators.maxLength(this.validations.maxlengthemailaddress)
      ])]
    });
  }

  ngOnInit() {
    this.processing = false;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  sendCode(): boolean {
    this.processing = true;
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
        this.processing = false;
      },
      complete: () => this.processing = false
    });
    return false;
  }

}
