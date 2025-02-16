import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { MyNavigation } from '../../commonmodule/navigation';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgIf, FontAwesomeModule],
  selector: "app-title",
  templateUrl: "./title.component.html",
})
export class TitleComponent {
  readonly iconName = input<IconName>();
  readonly center = input<boolean>(false);
  readonly title = input<string>("");
  readonly poolId = input<number>();

  constructor(private router: Router, private myNavigation: MyNavigation) {}

  navigateBack() {
    // if (this.poolId) {
    //   this.router.navigate(['/pool', this.poolId]);
    // } else {
    this.myNavigation.back();
    // }
  }
}

