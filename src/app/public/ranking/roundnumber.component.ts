import { Component, OnInit, Input } from '@angular/core';

import { RoundNumber, Poule, State, NameService, PlaceLocationMap } from 'ngx-sport';
import { Tournament } from '../../lib/pool';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-tournament-ranking-roundnumber',
    templateUrl: './roundnumber.component.html',
    styleUrls: ['./roundnumber.component.scss']
})
export class RankingRoundNumberComponent implements OnInit {
    @Input() tournament: Tournament;
    @Input() roundNumber: RoundNumber;
    public nameService: NameService;
    show: boolean;

    constructor(
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.nameService = new NameService(undefined);
        const state = this.roundNumber.getState();
        const statePrevious = this.roundNumber.hasPrevious() ? this.roundNumber.getPrevious().getState() : undefined;
        const stateNext = this.roundNumber.hasNext() ? this.roundNumber.getNext().getState() : undefined;
        const nextNeedsRanking = this.roundNumber.hasNext() && this.roundNumber.getNext().needsRanking();
        this.show = false;
        if (state === State.InProgress) {
            this.show = true;
        } else if (state === State.Created && (statePrevious === undefined || statePrevious === State.Finished)) {
            this.show = true;
        } else if (state === State.Finished && (stateNext === undefined || stateNext === State.Created || !nextNeedsRanking)) {
            this.show = true;
        }
    }

    openModal(templateRef) {
        const modalRef = this.modalService.open(templateRef);
    }

    getPoules(): Poule[] {
        return this.roundNumber.getPoules().filter(poule => poule.needsRanking());
    }
}
