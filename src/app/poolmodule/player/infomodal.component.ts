import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S11Player } from '../../lib/player';

@Component({
    selector: 'app-modal-s11playerinfo',
    templateUrl: './infomodal.component.html',
    styleUrls: ['./infomodal.component.scss']
})
export class S11PlayerInfoModalComponent implements OnInit {
    @Input() s11Player!: S11Player;

    constructor(public activeModal: NgbActiveModal) {

    }

    ngOnInit() {

    }
}
