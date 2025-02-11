import { Component, OnInit, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuperElfNameService } from '../../lib/nameservice';
import { Badge } from '../../lib/achievement/badge';
import { BadgeCategory } from '../../lib/achievement/badge/category';

@Component({
    selector: 'app-ngbd-modal-userbadges',
    templateUrl: './userbadges-modal.component.html',
    styleUrls: ['./userbadges-modal.component.scss']
})
export class UserBadgesModalComponent implements OnInit {
    readonly userName = input.required<string>();
    readonly badges = input.required<Badge[]>();
    private badgeCategoryMap: Map<string, string[]>;
    public processing = true;

    constructor(
        public modal: NgbActiveModal,
        public nameService: SuperElfNameService) {

        this.badgeCategoryMap = new Map();
    }

    get Goal(): BadgeCategory { return BadgeCategory.Goal}
    get Assist(): BadgeCategory { return BadgeCategory.Assist }
    get Result(): BadgeCategory { return BadgeCategory.Result }
    get Sheet(): BadgeCategory { return BadgeCategory.Sheet }
    get Card(): BadgeCategory { return BadgeCategory.Card }

    ngOnInit() {
        const badgeCategoryMap = new Map();
        this.badges().forEach((badge: Badge) => {
            const seasonShortNames = badgeCategoryMap.get(badge.getCategory()) ?? [];            
            seasonShortNames.push(badge.seasonShortName);
            seasonShortNames.sort((seasonShortName1: string, seasonShortName2: string) => {
                return seasonShortName1 >= seasonShortName2 ? -1 : 1;
            });
            badgeCategoryMap.set(badge.getCategory(), seasonShortNames);
        });
        this.badgeCategoryMap = badgeCategoryMap;
        this.processing = false;
    }

    getMaxLineNumbers(): number[] {
        let maxLineNrs = [];
        for (const [propertyKey, seasonShortNames] of this.badgeCategoryMap.entries()) {
            console.log('propertyKey', propertyKey)
            console.log('seasonShortNames',seasonShortNames)
            if (seasonShortNames.length > maxLineNrs.length) {
                maxLineNrs = [];
                for (let i = 0; i < seasonShortNames.length; i++) {                
                    maxLineNrs.push(i);
                }
            }
        }
        return maxLineNrs;
    }

    getBadgeSeasonShortName(badgeCategory: BadgeCategory, index: number): string {
        const seasonShortNames = this.badgeCategoryMap.get(badgeCategory);
        if (seasonShortNames === undefined) {
            return '';
        }
        const seasonShortName = seasonShortNames[index];
        if (seasonShortNames === undefined) {
            return '';
        }
        return seasonShortName;
    }
}

