import { Component, OnInit } from '@angular/core';
import { StartSessionService } from '../../shared/commonmodule/startSessionService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignInAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: "app-pool-prenew",
  standalone: true,
  imports: [FontAwesomeModule,RouterLink],
  templateUrl: "./prenew.component.html",
  styleUrls: ["./prenew.component.scss"],
})
export class PreNewComponent implements OnInit {
  public faUserCircle = faUserCircle;
  public faSignInAlt = faSignInAlt;

  constructor(private startSessionService: StartSessionService) {
    this.startSessionService.setCreateAction();
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   if (params.type !== undefined && params.message !== undefined) {
    //     this.alert = { type: params['type'], message: params['message'] };
    //   }
    // });
    // this.ngOnInitMyShells();
  }
}
