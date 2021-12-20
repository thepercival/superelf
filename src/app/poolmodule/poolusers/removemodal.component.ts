import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ngbd-modal-pooluser-remove',
    templateUrl: './removemodal.component.html',
    styleUrls: ['./removemodal.component.scss']
})
export class PoolUserRemoveModalComponent implements OnInit {
    @Input() entityName: string = '';
    @Input() name: string = '';

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {

    }
}