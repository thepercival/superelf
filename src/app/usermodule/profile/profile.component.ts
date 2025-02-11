import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../lib/user';
import { PasswordValidation } from '../password-validation';
import { UserRepository } from '../../lib/user/repository';
import { AuthService } from '../../lib/auth/auth.service';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { AuthComponent } from '../component';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { NgIf } from '@angular/common';
import { UserTitleComponent } from '../title/title.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: "app-profile",
  imports: [NgIf,NgbAlertModule,UserTitleComponent,FontAwesomeModule],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent extends AuthComponent implements OnInit {
  user: User | undefined;
  form: UntypedFormGroup;

  validations: UserValidations = {
    minlengthemailaddress: User.MIN_LENGTH_EMAIL,
    maxlengthemailaddress: User.MAX_LENGTH_EMAIL,
  };

  constructor(
    @Inject("route") private route: ActivatedRoute,
    @Inject("router") private router: Router,
    authService: AuthService,
    eventsManager: GlobalEventsManager,
    private userRepository: UserRepository,
    public myNavigation: MyNavigation,
    @Inject("fb") fb: UntypedFormBuilder
  ) {
    super(authService, eventsManager);
    this.form = fb.group(
      {
        emailaddress: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(this.validations.minlengthemailaddress),
            Validators.maxLength(this.validations.maxlengthemailaddress),
          ]),
        ],
      },
      {
        validator: PasswordValidation.MatchPassword, // your validation method
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userRepository.getObject(+params["id"]).subscribe({
        next: (user: User) => {
          this.user = user;
          this.form.controls.emailaddress.setValue(this.user.getEmailaddress());
        },
        error: (e) => {
          this.setAlert("danger", e);
          this.processing = false;
        },
        complete: () => (this.processing = false),
      });
    });
  }

  save(): boolean {
    if (!this.user) {
      return false;
    }
    this.processing = true;
    const emailaddress = this.form.controls.emailaddress.value;
    this.userRepository
      .editObject({ id: this.user.getId(), emailaddress: emailaddress })
      .subscribe({
        next: () => {
          this.setAlert("success", "het emailadres is opgeslagen");
          this.form.controls.emailaddress.setValue(emailaddress);
          // this.processing = false;
        },
        error: (e) => {
          this.setAlert("danger", "het opslaan is niet gelukt: " + e);
          this.processing = false;
        },
        complete: () => (this.processing = false),
      });
    return false;
  }

  remove() {
    if (!this.user) {
      return false;
    }
    this.processing = true;
    this.userRepository.removeObject(this.user.getId()).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate([""]);
        // this.processing = false;
      },
      error: (e) => {
        this.setAlert("danger", "het opslaan is niet gelukt: " + e);
        this.processing = false;
      },
      complete: () => (this.processing = false),
    });
  }
}

export interface UserValidations {
  minlengthemailaddress: number;
  maxlengthemailaddress: number;
}
