import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine } from 'ngx-sport';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { Pool } from '../../lib/pool';
import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
    selector: 'app-modal-s11playerinfo',
    templateUrl: './infomodal.component.html',
    styleUrls: ['./infomodal.component.scss']
})
export class S11PlayerInfoModalComponent implements OnInit {
    @Input() s11Player!: S11Player;
    @Input() pool!: Pool;

    constructor(
        public activeModal: NgbActiveModal,
        public cssService: CSSService) {

    }

    ngOnInit() {

    }

    getLineClass(): string {
        return this.cssService.getLine(this.s11Player.getLine());
    }
}
