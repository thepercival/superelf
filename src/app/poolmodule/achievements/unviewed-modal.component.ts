import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Badge } from '../../lib/achievement/badge';
import { Trophy } from '../../lib/achievement/trophy';

@Component({
    selector: 'app-ngbd-modal-unviewed',
    templateUrl: './unviewed-modal.component.html',
    styleUrls: ['./unviewed-modal.component.scss']
})
export class UnviewedAchievementsModalComponent implements OnInit {
    @Input() achievements!: (Trophy|Badge)[];
    public current: Trophy|Badge|undefined;

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {

    }
}