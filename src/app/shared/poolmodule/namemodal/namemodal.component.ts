import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VoetbalRange } from 'ngx-sport';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-ngbd-modal-name',
    templateUrl: './namemodal.component.html',
    styleUrls: ['./namemodal.component.scss']
})
export class NameModalComponent implements OnInit {
    @Input() header: string | undefined;
    @Input() range: VoetbalRange | undefined;
    @Input() initialName: string | undefined;
    @Input() labelName: string | undefined;
    @Input() buttonName: string | undefined;
    @Input() buttonOutline: boolean | undefined;
    form: UntypedFormGroup;

    constructor(public activeModal: NgbActiveModal, private fb: UntypedFormBuilder) {
        this.form = fb.group({
            name: ''
        });
    }

    ngOnInit() {
        const range = this.range ? this.range : undefined;
        if (range === undefined) {
            return;
        }
        this.form.controls.name.setValidators(
            Validators.compose([
                Validators.required,
                Validators.minLength(range.min),
                Validators.maxLength(range.max)
            ]));
        this.form.controls.name.setValue(this.initialName);
    }
}
