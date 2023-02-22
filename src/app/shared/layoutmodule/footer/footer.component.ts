import { Component, OnInit } from '@angular/core';
import { GlobalEventsManager } from '../../commonmodule/eventmanager';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {


  showFooter: boolean = false;

  constructor(private globalEventsManager: GlobalEventsManager) {

  }

  ngOnInit() {
    this.globalEventsManager.showFooter.subscribe((show: boolean) => {
      console.log('set showFooter', show );
      this.showFooter = show;
    });
  }

}
