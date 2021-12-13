import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-pool-public',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends PoolComponent implements OnInit {
    translate: TranslateService;
    scoutedPlayers: ScoutedPlayer[] = [];
    scoutingEnabled: boolean = false;
    poolUsers: PoolUser[] = [];

    constructor(
        route: ActivatedRoute,
        public cssService: CSSService,
        router: Router,
        private poolUserRepository: PoolUserRepository,
        poolRepository: PoolRepository,
        protected scoutedPlayerRepository: ScoutedPlayerRepository
    ) {
        super(route, router, poolRepository);
        this.translate = new TranslateService();
    }

    ngOnInit() {
        super.parentNgOnInit().subscribe({
            next: (pool: Pool) => {
                this.pool = pool;
                this.postNgOnInit(pool);
            },
            error: (e) => {
                this.setAlert('danger', e); this.processing = false;
            }
        });
    }

    postNgOnInit(pool: Pool) {
        this.scoutingEnabled = pool.getCreateAndJoinPeriod().isIn() || pool.getAssemblePeriod().isIn();
        if (this.scoutingEnabled) {
            const viewPeriod = pool.getAssembleViewPeriod();
            this.scoutedPlayerRepository.getObjects(viewPeriod).subscribe((scoutedPlayers: ScoutedPlayer[]) => {
                this.scoutedPlayers = scoutedPlayers;
            });
        }

        this.poolUserRepository.getObjectFromSession(pool)
            .subscribe({
                next: (poolUser: PoolUser | undefined) => {
                    this.poolUser = poolUser;
                    if (pool.isInEditPeriod() && this.isAdmin()) {
                        this.poolUserRepository.getObjects(pool).subscribe((poolUsers: PoolUser[]) => {
                            this.poolUsers = poolUsers;
                        });
                    }
                },
                error: (e) => {
                    this.setAlert('danger', e); this.processing = false;
                },
                complete: () => this.processing = false
            });
    }

    isAdmin(): boolean {
        return this.poolUser ? this.poolUser.getAdmin() : false;
    }

    getNrOfPoolUsersHaveAssembled(): number {
        return this.poolUsers.filter(poolUser => poolUser.getNrOfAssembled() === S11Formation.FootbalNrOfPersons).length;
    }

    allPoolUsersHaveAssembled(): boolean {
        return this.poolUsers.length === this.getNrOfPoolUsersHaveAssembled();
    }

    getNrOfPoolUsersHaveTransfered(): number {
        const max = this.pool.getTransferPeriod().getMaxNrOfTransfers();
        return this.poolUsers.filter(poolUser => poolUser.getNrOfTransferedWithTeam() === max).length;
    }

    allPoolUsersHaveTransfered(): boolean {
        return this.poolUsers.length === this.getNrOfPoolUsersHaveTransfered();
    }

    linkToAssemble() {
        if (this.poolUser?.getAssembleFormation() !== undefined) {
            this.router.navigate(['/pool/assemble', this.pool.getId()]);
        } else {
            this.router.navigate(['/pool/chooseformation', this.pool.getId()]);
        }
    }


}
