import { Component, input } from '@angular/core';
import { IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { BadgeCategory } from '../../../lib/achievement/badge/category';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    standalone: true,
    imports: [FontAwesomeModule],
    selector: 'app-superelf-badge-icon',
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss']
})
export class SuperElfBadgeIconComponent {
    readonly badgeCategory = input<BadgeCategory>();
    readonly competitionConfig = input(true);
    readonly size = input<SizeProp>();

    getPrefix(): IconPrefix { 
        if (
          this.badgeCategory() === BadgeCategory.Goal ||
          this.badgeCategory() === BadgeCategory.Card
        ) {
          return "fas";
        }
        return <IconPrefix>'fac'; 
    }

    getIconName(): IconName { 
        switch (this.badgeCategory()) {
          case BadgeCategory.Result:
            return <IconName>"scoreboard";
          case BadgeCategory.Goal:
            return "futbol";
          case BadgeCategory.Assist:
            return <IconName>"cornerflag";
          case BadgeCategory.Sheet:
            return <IconName>"clean-sheet";
          case BadgeCategory.Card:
            return "handshake-angle";
        }
        throw new Error('unknown badgeCategory');
    }

    get color(): string { 
        return this.competitionConfig() ? 'text-silver' : 'text-gold';
    }
}