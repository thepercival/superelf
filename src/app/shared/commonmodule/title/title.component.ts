import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { MyNavigation } from '../../commonmodule/navigation';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: "app-title",
  templateUrl: "./title.component.html",
})
export class TitleComponent {
  readonly icon = input<IconDefinition>();
  readonly center = input<boolean>(false);
  readonly title = input<string>("");
  readonly poolId = input<number>();

  public faLevelUpAlt = faLevelUpAlt;

  constructor(private router: Router, private myNavigation: MyNavigation) {}

  navigateBack() {
    // if (this.poolId) {
    //   this.router.navigate(['/pool', this.poolId]);
    // } else {
    this.myNavigation.back();
    // }
  }
}

