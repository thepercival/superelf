import { Component, Input } from '@angular/core';
import { IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { BadgeCategory } from '../../../lib/achievement/badge/category';

@Component({
    selector: 'app-superelf-badge-icon',
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss']
})
export class SuperElfBadgeIconComponent {
    @Input() badgeCategory: BadgeCategory | undefined;
    @Input() competitionConfig = true;
    @Input() size: SizeProp|undefined;

    getPrefix(badgeCategory: BadgeCategory): IconPrefix { 
        if( badgeCategory === BadgeCategory.Goal || this.badgeCategory === BadgeCategory.Card ) {
            return 'fas'; 
        }
        return <IconPrefix>'fac'; 
    }

    getIconName(badgeCategory: BadgeCategory): IconName { 
        switch (badgeCategory) {
            case BadgeCategory.Result:
              return <IconName>'scoreboard';
            case BadgeCategory.Goal:
                return 'futbol';
            case BadgeCategory.Assist:
                return <IconName>'cornerflag';
            case BadgeCategory.Sheet:
                return <IconName>'clean-sheet';
            case BadgeCategory.Card:
                return 'handshake-angle';
        }
    }

    get color(): string { 
        return this.competitionConfig ? 'text-silver' : 'text-gold';
    }
}