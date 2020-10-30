import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { League } from 'ngx-sport';

import { AuthService } from '../../lib/auth/auth.service';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { TranslateService } from '../../lib/translate';
import { NameModalComponent } from '../../shared/poolmodule/namemodal/namemodal.component';

@Component({
    selector: 'app-pool-admin',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends PoolComponent implements OnInit {
    minDateStruct: NgbDateStruct;
    translate: TranslateService;

    constructor(
        route: ActivatedRoute,
        private modalService: NgbModal,
        public cssService: CSSService,
        router: Router,
        private authService: AuthService,
        poolRepository: PoolRepository,
        fb: FormBuilder
    ) {
        super(route, router, poolRepository);
        this.translate = new TranslateService();
        const date = new Date();
        this.minDateStruct = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };

    }

    ngOnInit() {
        super.myNgOnInit(() => this.postNgOnInit());
    }

    postNgOnInit() {
        const date = new Date();

        this.processing = false;
    }


    getNrOfCompetitors(): number {
        return this.pool.getCompetitors().length;
    }

    getNrOfPlaces(): number {
        return this.structure.getFirstRoundNumber().getNrOfPlaces();
    }

    allPlacesAssigned(): boolean {
        return this.getNrOfCompetitors() === this.getNrOfPlaces();
    }

    someCompetitorsRegistered(): boolean {
        const competitors = this.pool.getCompetitors();
        return competitors.some(competitor => competitor.getRegistered()) && !competitors.every(competitor => competitor.getRegistered());
    }

    isAdmin(): boolean {
        return this.pool.getCompetitor(this.authService.getUser())?.getAdmin();
    }

    remove() {
        this.setAlert('info', 'het toernooi wordt verwijderd');
        this.processing = true;
        this.poolRepository.removeObject(this.pool)
            .subscribe(
                /* happy path */(deleted: boolean) => {
                    if (deleted) {
                        const navigationExtras: NavigationExtras = {
                            queryParams: { type: 'success', message: 'het toernooi is verwijderd' }
                        };
                        this.router.navigate(['/'], navigationExtras);
                    } else {
                        this.setAlert('danger', 'het toernooi kon niet verwijderd worden');
                        this.processing = false;
                    }
                    // redirect to home with message
                },
                /* error path */ e => {
                    this.setAlert('danger', 'het toernooi kon niet verwijderd worden');
                    this.processing = false;
                },
                /* onComplete */() => { this.processing = false; }
            );
    }

    isManualMessageReadOnDevice() {
        let manualMessageReadOnDevice = localStorage.getItem('manualmessageread');
        if (manualMessageReadOnDevice === null) {
            manualMessageReadOnDevice = 'false';
        }
        return JSON.parse(manualMessageReadOnDevice);
    }

    manualMessageReadOnDevice() {
        localStorage.setItem('manualmessageread', JSON.stringify(true));
    }

    openModalName() {
        const activeModal = this.modalService.open(NameModalComponent);
        activeModal.componentInstance.header = 'toernooinaam';
        activeModal.componentInstance.range = { min: League.MIN_LENGTH_NAME, max: League.MAX_LENGTH_NAME };
        activeModal.componentInstance.initialName = this.pool.getCollection().getName();
        activeModal.componentInstance.labelName = this.pool.getCollection().getName();
        activeModal.componentInstance.buttonName = 'wijzigen';

        activeModal.result.then((result) => {
            this.saveName(result);
        }, (reason) => {
        });
    }

    openModalRemove(modalContent) {
        const activeModal = this.modalService.open(modalContent);
        activeModal.result.then((result) => {
            if (result === 'remove') {
                this.remove();
            }
        }, (reason) => {
        });
    }

    linkToStructure() {
        this.router.navigate(['/admin/structure', this.pool.getId()]);
    }

    getCurrentYear() {
        const date = new Date();
        return date.getFullYear();
    }



    saveName(newName: string) {
        this.setAlert('info', 'de naam wordt opgeslagen');

        this.processing = true;
        this.pool.getCollection().setName(newName);
        this.poolRepository.editObject(this.pool)
            .subscribe(
                /* happy path */(poolRes: Pool) => {
                    this.pool = poolRes;
                    // this.router.navigate(['/admin', newPoolId]);
                    this.setAlert('success', 'de naam is opgeslagen');
                },
                /* error path */ e => {
                    this.setAlert('danger', 'de naam kon niet worden opgeslagen');
                    this.processing = false;
                },
                /* onComplete */() => { this.processing = false; }
            );
    }
}
