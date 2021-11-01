import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from 'ngx-sport';

@Component({
    selector: 'app-modal-personinfo',
    templateUrl: './infomodal.component.html',
    styleUrls: ['./infomodal.component.scss']
})
export class PersonInfoModalComponent implements OnInit {
    @Input() person: Person | undefined;

    constructor(public activeModal: NgbActiveModal) {

    }

    ngOnInit() {

    }
}
