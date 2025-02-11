import { Component, OnInit, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VoetbalRange } from 'ngx-sport';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-ngbd-modal-name',
    templateUrl: './namemodal.component.html',
    styleUrls: ['./namemodal.component.scss']
})
export class NameModalComponent implements OnInit {
    readonly header = input<string>();
    readonly range = input<VoetbalRange>();
    readonly initialName = input<string>();
    readonly labelName = input<string>();
    readonly buttonName = input<string>();
    readonly buttonOutline = input<boolean>();
    form: UntypedFormGroup;

    constructor(public activeModal: NgbActiveModal, private fb: UntypedFormBuilder) {
        this.form = fb.group({
            name: ''
        });
    }

    ngOnInit() {
        const rangeValue = this.range();
        const range = rangeValue ? rangeValue : undefined;
        if (range === undefined) {
            return;
        }
        this.form.controls.name.setValidators(
            Validators.compose([
                Validators.required,
                Validators.minLength(range.min),
                Validators.maxLength(range.max)
            ]));
        this.form.controls.name.setValue(this.initialName());
    }
}
