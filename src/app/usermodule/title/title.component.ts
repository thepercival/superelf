import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { IconDefinition, IconName } from '@fortawesome/fontawesome-svg-core';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: "app-user-title",
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./title.component.html",
})
export class UserTitleComponent {
  readonly title = input<string>("");
  readonly icon = input.required<IconDefinition>();

  constructor(private myNavigation: MyNavigation) {}

  navigateBack() {
    this.myNavigation.back();
  }
}

