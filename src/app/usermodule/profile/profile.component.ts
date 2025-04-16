import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../lib/user';
import { PasswordValidation } from '../password-validation';
import { UserRepository } from '../../lib/user/repository';
import { AuthService } from '../../lib/auth/auth.service';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { AuthComponent } from '../component';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { UserTitleComponent } from '../title/title.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: "app-profile",
  imports: [NgbAlertModule, UserTitleComponent, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent extends AuthComponent implements OnInit {
  faUserCirlce = faUserCircle;
  user: User | undefined;
  form: UntypedFormGroup;

  validations: UserValidations = {
    minlengthemailaddress: User.MIN_LENGTH_EMAIL,
    maxlengthemailaddress: User.MAX_LENGTH_EMAIL,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    authService: AuthService,
    eventsManager: GlobalEventsManager,
    private userRepository: UserRepository,
    public myNavigation: MyNavigation,
    fb: UntypedFormBuilder
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
          this.processing.set(false);
        },
        complete: () => (this.processing.set(false)),
      });
    });
  }

  save(): boolean {
    if (!this.user) {
      return false;
    }
    this.processing.set(true);
    const emailaddress = this.form.controls.emailaddress.value;
    this.userRepository
      .editObject({ id: this.user.getId(), emailaddress: emailaddress })
      .subscribe({
        next: () => {
          this.setAlert("success", "het emailadres is opgeslagen");
          this.form.controls.emailaddress.setValue(emailaddress);
          // this.processing.set(false);
        },
        error: (e) => {
          this.setAlert("danger", "het opslaan is niet gelukt: " + e);
          this.processing.set(false);
        },
        complete: () => (this.processing.set(false)),
      });
    return false;
  }

  remove() {
    if (!this.user) {
      return false;
    }
    this.processing.set(true);
    this.userRepository.removeObject(this.user.getId()).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate([""]);
        // this.processing.set(false);
      },
      error: (e) => {
        this.setAlert("danger", "het opslaan is niet gelukt: " + e);
        this.processing.set(false);
      },
      complete: () => (this.processing.set(false)),
    });
  }

  navigateToLogout(): void {
    this.router.navigate(["user/logout"]);
  }
}

export interface UserValidations {
  minlengthemailaddress: number;
  maxlengthemailaddress: number;
}
