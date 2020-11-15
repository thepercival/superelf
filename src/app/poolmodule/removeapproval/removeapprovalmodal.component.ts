import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ngbd-modal-pooluser-remove-approval',
    templateUrl: './removeapprovalmodal.component.html',
    styleUrls: ['./removeapprovalmodal.component.scss']
})
export class RemoveApprovalModalComponent implements OnInit {
    @Input() entityName: string = '';
    @Input() name: string = '';

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {

    }
}