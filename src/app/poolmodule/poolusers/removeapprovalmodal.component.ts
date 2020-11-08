import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PoolUser } from '../../lib/pool/user';

@Component({
    selector: 'app-ngbd-modal-pooluser-remove-approval',
    templateUrl: './removeapprovalmodal.component.html',
    styleUrls: ['./removeapprovalmodal.component.scss']
})
export class PoolUserRemoveApprovalModalComponent implements OnInit {
    @Input() poolUser: PoolUser;

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {

    }
}