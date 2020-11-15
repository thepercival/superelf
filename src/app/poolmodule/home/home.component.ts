import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { PoolComponent } from '../../shared/poolmodule/component';
import { TranslateService } from '../../lib/translate';
import { PoolRepository } from '../../lib/pool/repository';
import { ScoutedPerson } from '../../lib/scoutedPerson';
import { Pool } from '../../lib/pool';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';

@Component({
    selector: 'app-pool-public',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends PoolComponent implements OnInit {
    translate: TranslateService;
    scoutedPersons: ScoutedPerson[] = [];
    scoutingEnabled: boolean = false;

    constructor(
        route: ActivatedRoute,
        public cssService: CSSService,
        router: Router,
        private poolUserRepository: PoolUserRepository,
        poolRepository: PoolRepository,
        protected scoutedPersonRepository: ScoutedPersonRepository
    ) {
        super(route, router, poolRepository);
        this.translate = new TranslateService();
    }

    ngOnInit() {
        super.parentNgOnInit().subscribe((pool: Pool) => {
            this.pool = pool;
            this.postNgOnInit(pool);
        });
    }

    postNgOnInit(pool: Pool) {
        const sourceCompetition = pool.getSourceCompetition();
        this.scoutingEnabled = pool.getCreateAndJoinPeriod().isIn() || pool.getAssemblePeriod().isIn();

        if (this.scoutingEnabled) {
            this.scoutedPersonRepository.getObjects(sourceCompetition).subscribe((scoutedPersons: ScoutedPerson[]) => {
                this.scoutedPersons = scoutedPersons;
            });
        }

        this.poolUserRepository.getObject(pool).subscribe((poolUser: PoolUser | undefined) => {
            this.poolUser = poolUser;
        },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false });
    }

    isAdmin(): boolean {
        return this.poolUser ? this.poolUser.getAdmin() : false;

        // aparte call naar pooluser 

        // kijk in welke periode je zit en dan 1 van onderstaande drie ophalen (kan eventueel 1 url gebruiken)
        //     nrOfPoolUsers: Number,
        //     nrHaveAssembled
        //     nrHaveTransfered: number
    }

    allPoolUsersHaveAssembled(): boolean {


        return false;
    }

    allPoolUsersHaveTransfered(): boolean {

        return false;
    }



}
