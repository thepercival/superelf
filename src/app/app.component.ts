import { Component } from '@angular/core';

import { MyNavigation } from './shared/commonmodule/navigation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SuperElf';

  constructor(
    protected myNavigation: MyNavigation
  ) {
  }
}
