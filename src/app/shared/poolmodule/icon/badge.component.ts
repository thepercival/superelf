import { Component, input } from '@angular/core';
import { IconDefinition, IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { BadgeCategory } from '../../../lib/achievement/badge/category';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faFutbol, faHandshakeAngle } from '@fortawesome/free-solid-svg-icons';
import { facCleanSheet, facCornerFlag, facScoreboard } from '../icons';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: "app-superelf-badge-icon",
  templateUrl: "./badge.component.html",
  styleUrls: ["./badge.component.scss"],
})
export class SuperElfBadgeIconComponent {
  readonly badgeCategory = input<BadgeCategory>();
  readonly competitionConfig = input(true);
  readonly size = input<SizeProp>();
  public faCircle = faCircle;

  // getPrefix(): IconPrefix {
  //   if (
  //     this.badgeCategory() === BadgeCategory.Goal ||
  //     this.badgeCategory() === BadgeCategory.Card
  //   ) {
  //     return "fas";
  //   }
  //   return <IconPrefix>"fac";
  // }

  getIconDefinition(): IconDefinition {
    switch (this.badgeCategory()) {
      case BadgeCategory.Result:
        return facScoreboard;
      case BadgeCategory.Goal:
        return faFutbol;
      case BadgeCategory.Assist:
        return facCornerFlag;
      case BadgeCategory.Sheet:
        return facCleanSheet;
      case BadgeCategory.Card:
        return faHandshakeAngle;
    }
    throw new Error("unknown badgeCategory");
  }

  get color(): string {
    return this.competitionConfig() ? "text-silver" : "text-gold";
  }
}