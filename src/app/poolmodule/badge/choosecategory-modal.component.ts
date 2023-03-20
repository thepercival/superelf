import { Component, Input, OnInit } from '@angular/core';
import { SuperElfNameService } from '../../lib/nameservice';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LeagueName } from '../../lib/leagueName';

@Component({
    selector: 'app-ngbd-modal-choosecategory',
    templateUrl: './choosecategory-modal.component.html',
    styleUrls: ['./choosecategory-modal.component.scss']
})
export class ChooseBadgeCategoryModalComponent implements OnInit {
    @Input() currentBadgeCategory: BadgeCategory|undefined;
    
    public choosableBadgeCategories: BadgeCategory[];
    public leagueName = LeagueName.Competition;

    constructor(public modal: NgbActiveModal, public nameService: SuperElfNameService) {
        this.choosableBadgeCategories = Object.values(BadgeCategory);
    }

    ngOnInit() {
        
        
    }
}

