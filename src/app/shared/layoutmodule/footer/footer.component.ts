import { Component, OnInit } from '@angular/core';
import { GlobalEventsManager } from '../../commonmodule/eventmanager';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faCopyright } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  faEnvelope = faEnvelope;
  faCopyRight = faCopyright;
  showFooter: boolean = false;

  constructor(
    private globalEventsManager: GlobalEventsManager
  ) {
    
  }

  ngOnInit() {
    this.globalEventsManager.showFooter.subscribe((show: boolean) => {
      this.showFooter = show;
    });
  }
}
