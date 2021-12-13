import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S11Player } from '../../lib/player';

@Component({
    selector: 'app-ngbd-modal-confirm-player-choice',
    templateUrl: './confirmchoicemodal.component.html',
    styleUrls: ['./confirmchoicemodal.component.scss']
})
export class ConfirmS11PlayerChoiceModalComponent implements OnInit {
    @Input() s11Player: S11Player | undefined;

    constructor(public activeModal: NgbActiveModal) {

    }

    ngOnInit() {

    }
}
