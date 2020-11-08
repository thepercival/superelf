import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../lib/auth/auth.service';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { PoolComponent } from '../../shared/poolmodule/component';
import { TranslateService } from '../../lib/translate';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolPeriod } from '../../lib/pool/period';

@Component({
    selector: 'app-pool-public',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends PoolComponent implements OnInit {
    translate: TranslateService;
    scoutedPersons: ScoutedPerson[] = [];

    constructor(
        route: ActivatedRoute,
        public cssService: CSSService,
        router: Router,
        private authService: AuthService,
        poolRepository: PoolRepository
    ) {
        super(route, router, poolRepository);
        this.translate = new TranslateService();
    }

    ngOnInit() {
        super.myNgOnInit(() => this.postNgOnInit());
    }

    postNgOnInit() {

        this.processing = false;
    }

    isAdmin(): boolean {
        return this.pool.getUser(this.authService.getUser())?.getAdmin();
    }

    allUsersHaveCompletedTeamChoice(): boolean {
        return false;
    }

    allUsersHaveCompletedTransfers(): boolean {
        return false;
    }
}
