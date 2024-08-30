import { Component, Input, OnInit } from '@angular/core';
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
    @Input() userName!: string;
    @Input() badges!: Badge[];

    constructor(
        public modal: NgbActiveModal,
        public nameService: SuperElfNameService) {
    }

    get Goal(): BadgeCategory { return BadgeCategory.Goal}
    get Assist(): BadgeCategory { return BadgeCategory.Assist }
    get Result(): BadgeCategory { return BadgeCategory.Result }
    get Sheet(): BadgeCategory { return BadgeCategory.Sheet }
    get Card(): BadgeCategory { return BadgeCategory.Card }

    ngOnInit() {
    }

    getSeasonShortName(scopeDescription: string): string {
        const pos = scopeDescription.lastIndexOf(' ');
        if (pos < 0 ) {
            return '?';
        }
        return scopeDescription.substring(pos);
    }
}

