import { Component, OnInit, input } from '@angular/core';
import { SuperElfNameService } from '../../lib/nameservice';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LeagueName } from '../../lib/leagueName';
import { SuperElfBadgeIconComponent } from '../../shared/poolmodule/icon/badge.component';
import { SuperElfTrophyIconComponent } from '../../shared/poolmodule/icon/trophy.component';

@Component({
    selector: 'app-ngbd-modal-choosecategory',
    standalone: true,
    imports: [SuperElfBadgeIconComponent,SuperElfTrophyIconComponent],
    templateUrl: './choosecategory-modal.component.html',
    styleUrls: ['./choosecategory-modal.component.scss']
})
export class ChooseBadgeCategoryModalComponent implements OnInit {
    readonly currentBadgeCategory = input<BadgeCategory>();
    
    public choosableBadgeCategories: BadgeCategory[];
    public leagueName = LeagueName.Competition;

    constructor(public modal: NgbActiveModal, public nameService: SuperElfNameService) {
        this.choosableBadgeCategories = Object.values(BadgeCategory);
    }

    ngOnInit() {
        
        
    }
}

