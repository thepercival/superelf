import { Component, OnInit, input, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ngbd-modal-pooluser-remove',
    templateUrl: './removemodal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./removemodal.component.scss']
})
export class PoolUserRemoveModalComponent implements OnInit {
    readonly entityName = input<string>('');
    readonly name = input<string>('');

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {

    }
}