import { Component, input } from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgIf],
  selector: "app-user-title",
  templateUrl: "./title.component.html",
})
export class UserTitleComponent {
  readonly title = input<string>("");
  readonly icon = input<IconName>();

  constructor(private myNavigation: MyNavigation) {}

  navigateBack() {
    this.myNavigation.back();
  }
}

