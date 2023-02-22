import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { PoolComponent } from '../../shared/poolmodule/component';
import { TranslateService } from '../../lib/translate';
import { PoolRepository } from '../../lib/pool/repository';
import { Pool } from '../../lib/pool';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { S11Formation } from '../../lib/formation';
import { ScoutedPlayer } from '../../lib/scoutedPlayer';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { Period } from 'ngx-sport';
import { DateFormatter } from '../../lib/dateFormatter';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { LeagueName } from '../../lib/leagueName';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAlert } from '../../shared/commonmodule/alert';
import { concatMap } from 'rxjs';
import { CompetitionsNavBarItem, NavBarItem } from '../../shared/poolmodule/poolNavBar/items';

@Component({
    selector: 'app-pool-worldcup',
    templateUrl: './worldcup.component.html',
    styleUrls: ['./worldcup.component.css']
})
export class WorldCupComponent implements OnInit {
    public alert: IAlert | undefined;
    public processing = true;
    translate: TranslateService;
    public originPool: Pool|undefined;
    // scoutedPlayers: ScoutedPlayer[] = [];
    // scoutingEnabled: boolean = false;
    // poolUsers: PoolUser[] = [];

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected poolRepository: PoolRepository,
        protected globalEventsManager: GlobalEventsManager,
        public cssService: CSSService,
        private dateFormatter: DateFormatter,
        private poolUserRepository: PoolUserRepository,
        protected scoutedPlayerRepository: ScoutedPlayerRepository,
        protected modalService: NgbModal
    ) {
        //   super(route, router, poolRepository, globalEventsManager);
        this.translate = new TranslateService();
    }

    ngOnInit() {
        this.processing = false;
        this.route.params.pipe(
            concatMap(params => {
                return this.poolRepository.getObject(+params.originPoolId);
            }),
        ).subscribe({
            next: (pool: Pool) => {
                this.originPool = pool;
            }
        });
        
    }

    get Competitions(): NavBarItem { return NavBarItem.Competitions }
    get WorldCupStructure(): CompetitionsNavBarItem { return CompetitionsNavBarItem.WorldCupStructure }

    postNgOnInit(pool: Pool) {
        // this.scoutingEnabled = pool.getCreateAndJoinPeriod().isIn() || pool.getAssemblePeriod().isIn();
        // if (this.scoutingEnabled) {
        //     const viewPeriod = pool.getAssembleViewPeriod();
        //     const competition = this.pool.getSourceCompetition();
        //     this.scoutedPlayerRepository.getObjects(competition, viewPeriod).subscribe((scoutedPlayers: ScoutedPlayer[]) => {
        //         this.scoutedPlayers = scoutedPlayers;
        //     });
        // }

        // this.poolUserRepository.getObjectFromSession(pool)
        //     .subscribe({
        //         next: (poolUser: PoolUser | undefined) => {
        //             this.poolUser = poolUser;
        //             // console.log('ssss', this.poolUser);
        //             if (pool.isInEditPeriod() && this.isAdmin()) {
        //                 this.poolUserRepository.getObjects(pool).subscribe((poolUsers: PoolUser[]) => {
        //                     this.poolUsers = poolUsers;
        //                 });
        //             }
        //         },
        //         error: (e: string) => {
        //             this.setAlert('danger', e); this.processing = false;
        //         },
        //         complete: () => this.processing = false
        //     });
    }

    // isAdmin(): boolean {
    //     return this.poolUser ? this.poolUser.getAdmin() : false;
    // }

    // getNrOfPoolUsersHaveAssembled(): number {
    //     return this.poolUsers.filter(poolUser => poolUser.getNrOfAssembled() === S11Formation.FootbalNrOfPersons).length;
    // }

    // allPoolUsersHaveAssembled(): boolean {
    //     return this.poolUsers.length === this.getNrOfPoolUsersHaveAssembled();
    // }

    // getCompetitionCompetitors(): PoolCompetitor[] {
    //     return this.pool.getCompetitors(LeagueName.Competition);
    // }

    // openModal(modalContent: TemplateRef<any>) {
    //     const activeModal = this.modalService.open(modalContent);
    //     activeModal.result.then(() => {
    //     }, () => {
    //     });
    // }

    // // getNrOfPoolUsersHaveTransfered(): number {
    // //     const max = this.pool.getTransferPeriod().getMaxNrOfTransfers();
    // //     return this.poolUsers.filter(poolUser => poolUser.getNrOfTransferedWithTeam() === max).length;
    // // }

    // // allPoolUsersHaveTransfered(): boolean {
    // //     return this.poolUsers.length === this.getNrOfPoolUsersHaveTransfered();
    // // }

    // linkToAssemble() {
    //     if (!this.inAssembleMode()) {
    //         return;
    //     }
    //     if (this.poolUser?.getAssembleFormation() !== undefined) {
    //         this.router.navigate(['/pool/formation/assemble', this.pool.getId()]);
    //     } else {
    //         this.router.navigate(['/pool/formation/choose', this.pool.getId()]);
    //     }
    // }

    // showAssemble(): boolean {
    //     const now = new Date();
    //     return this.pool.getAssemblePeriod().isIn();
    // }

    // inAssembleMode(): boolean {
    //     return this.pool.getAssemblePeriod().isIn();
    // }

    // inBeforeStart(): boolean {
    //     return this.pool.getStartDateTime().getTime() > (new Date()).getTime();
    // }

    // inBeforeAssemble(): boolean {
    //     return this.pool.getAssemblePeriod().getStartDateTime().getTime() > (new Date()).getTime();
    // }

    // getStartAssembleDate(): string {
    //     return 'vanaf ' + this.dateFormatter.toString(this.pool.getAssemblePeriod().getStartDateTime(), this.dateFormatter.niceDateTime()) + ' uur';
    // }

    // getNrAssembled(): number {
    //     return (this.poolUser?.getNrOfAssembled() ?? 0);
    // }
}
