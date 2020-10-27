import { Component, OnInit, Input } from '@angular/core';
import { Field, SportConfig, JsonField, Structure } from 'ngx-sport';

import { FieldRepository } from '../../../lib/ngx-sport/field/repository';
import { PlanningRepository } from '../../../lib/ngx-sport/planning/repository';
import { IAlert } from '../../../shared/common/alert';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NameModalComponent } from '../../../shared/tournament/namemodal/namemodal.component';
import { TranslateService } from '../../../lib/translate';
import { Tournament } from '../../../lib/pool';

@Component({
    selector: 'app-tournament-fields',
    templateUrl: './fieldlist.component.html',
    styleUrls: ['./fieldlist.component.scss']
})
export class FieldListComponent implements OnInit {

    alert: IAlert;
    processing: boolean;
    @Input() tournament: Tournament;
    @Input() structure: Structure;
    @Input() sportConfig: SportConfig;
    @Input() hasBegun: boolean;
    prioritizable: boolean;

    constructor(
        private fieldRepository: FieldRepository,
        private planningRepository: PlanningRepository,
        private modalService: NgbModal,
    ) {
        this.processing = true;

    }

    ngOnInit() {
        if (this.hasBegun) {
            this.alert = { type: 'warning', message: 'er zijn al wedstrijden gespeeld, je kunt niet meer toevoegen en verwijderen' };
        }
        this.prioritizable = !this.sportConfig.getCompetition().hasMultipleSportConfigs();
        this.processing = false;
    }

    getFieldDescription(): string {
        const translate = new TranslateService();
        return translate.getFieldNameSingular(this.sportConfig.getSport());
    }

    getChangeNameModel(buttonLabel: string, initialName?: string): NgbModalRef {
        const activeModal = this.modalService.open(NameModalComponent);
        activeModal.componentInstance.header = this.getFieldDescription() + 'naam';
        activeModal.componentInstance.range = { min: Field.MIN_LENGTH_NAME, max: Field.MAX_LENGTH_NAME };
        activeModal.componentInstance.buttonName = buttonLabel;
        activeModal.componentInstance.initialName = initialName;
        activeModal.componentInstance.labelName = 'naam';
        activeModal.componentInstance.buttonOutline = true;
        return activeModal;
    }

    addField() {
        this.alert = undefined;
        const modal = this.getChangeNameModel('toevoegen');
        modal.result.then((resName: string) => {
            this.processing = true;
            const jsonField: JsonField = {
                priority: this.sportConfig.getCompetition().getFields().length + 1,
                name: resName
            };
            this.fieldRepository.createObject(jsonField, this.sportConfig, this.tournament).subscribe(
                /* happy path */(fieldRes) => this.updatePlanning(),
                /* error path */ e => { this.alert = { type: 'danger', message: e }; this.processing = false; },
            );
        }, (reason) => {
        });
    }

    editField(field: Field) {
        this.alert = undefined;
        const modal = this.getChangeNameModel('wijzigen', field.getName());
        modal.result.then((resName: string) => {
            this.processing = true;
            field.setName(resName);
            this.fieldRepository.editObject(field, this.tournament)
                .subscribe(
            /* happy path */() => { },
            /* error path */ e => { this.alert = { type: 'danger', message: e }; this.processing = false; },
            /* onComplete */() => { this.processing = false; }
                );
        }, (reason) => {
        });
    }

    upgradePriority(field: Field) {
        this.processing = true;
        this.fieldRepository.upgradeObject(field, this.tournament)
            .subscribe(
            /* happy path */() => this.updatePlanning(),
            /* error path */ e => { this.alert = { type: 'danger', message: e }; this.processing = false; },
            );
    }

    removeField(field: Field) {
        this.processing = true;

        this.fieldRepository.removeObject(field, this.tournament)
            .subscribe(
            /* happy path */() => this.updatePlanning(),
            /* error path */ e => { this.alert = { type: 'danger', message: e }; this.processing = false; },
            );
    }

    protected updatePlanning() {
        this.planningRepository.create(this.structure, this.tournament, 1).subscribe(
            /* happy path */ roundNumberOut => {
                // this.processing = false;
            },
            /* error path */ e => { this.alert = { type: 'danger', message: e }; this.processing = false; },
            /* onComplete */() => this.processing = false
        );
    }
}
