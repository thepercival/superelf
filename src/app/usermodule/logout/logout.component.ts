import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../lib/auth/auth.service';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { AuthComponent } from '../component';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent extends AuthComponent implements OnInit {

  constructor(private router: Router, authService: AuthService, eventsManager: GlobalEventsManager) {
    super(authService, eventsManager);
  }

  ngOnInit() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
