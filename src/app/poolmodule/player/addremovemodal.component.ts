import { Component, OnInit, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Player } from 'ngx-sport';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { ScorePointsMap } from '../../lib/score/points';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { PlayerBasicsComponent } from './basics.component';

@Component({
    selector: 'app-modal-s11player-addremove',
    standalone: true,
    imports: [PlayerBasicsComponent],
    templateUrl: './addremovemodal.component.html',
    styleUrls: ['./addremovemodal.component.scss']
})
export class S11PlayerAddRemoveModalComponent implements OnInit {
    readonly s11Player = input.required<S11Player>();
    readonly action = input.required<PlayerAction>();
    readonly scorePointsMap = input.required<ScorePointsMap>();

    public player: Player | undefined;

    constructor(
        public activeModal: NgbActiveModal,
        public cssService: CSSService) {

    }

    ngOnInit() {
        this.player = (new OneTeamSimultaneous()).getCurrentPlayer(this.s11Player());
    }

    get Add(): PlayerAction { return PlayerAction.Add }
    get Remove(): PlayerAction { return PlayerAction.Remove }

    getLineClass(): string {
        return this.cssService.getLine(this.s11Player().getLine());
    }

    getTotalPoints(): number {
        return this.s11Player().getTotalPoints(this.scorePointsMap(), undefined);
    }
}

export enum PlayerAction {
    Add = 1,
    Remove
}