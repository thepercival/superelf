import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from 'ngx-sport';

@Component({
    selector: 'app-ngbd-modal-confirmpersonchoice',
    templateUrl: './confirmpersonchoicemodal.component.html',
    styleUrls: ['./confirmpersonchoicemodal.component.scss']
})
export class ConfirmPersonChoiceModalComponent implements OnInit {
    @Input() person: Person | undefined;

    constructor(public activeModal: NgbActiveModal) {

    }

    ngOnInit() {

    }
}
