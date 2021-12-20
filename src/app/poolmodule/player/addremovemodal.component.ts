import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine, Player } from 'ngx-sport';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { Pool } from '../../lib/pool';
import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
    selector: 'app-modal-s11player-addremove',
    templateUrl: './addremovemodal.component.html',
    styleUrls: ['./addremovemodal.component.scss']
})
export class S11PlayerAddRemoveModalComponent implements OnInit {
    @Input() s11Player!: S11Player;
    @Input() action!: PlayerAction;

    public player: Player | undefined;

    constructor(
        public activeModal: NgbActiveModal,
        public cssService: CSSService) {

    }

    ngOnInit() {
        this.player = (new OneTeamSimultaneous()).getCurrentPlayer(this.s11Player.getPerson());
    }

    get Add(): PlayerAction { return PlayerAction.Add }
    get Remove(): PlayerAction { return PlayerAction.Remove }

    getLineClass(): string {
        return this.cssService.getLine(this.s11Player.getLine());
    }
}

export enum PlayerAction {
    Add = 1,
    Remove
}