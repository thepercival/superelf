import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../lib/auth/auth.service';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { PoolComponent } from '../../shared/poolmodule/component';
import { TranslateService } from '../../lib/translate';
import { PoolRepository } from '../../lib/pool/repository';
import { FavoritesRepository } from '../../lib/favorites/repository';
import { Favorites } from '../../lib/favorites';
import { PoolCompetitor } from '../../lib/competitor';

@Component({
    selector: 'app-pool-public',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends PoolComponent implements OnInit {
    translate: TranslateService;
    competitors: PoolCompetitor[];
    favorites: Favorites;

    constructor(
        route: ActivatedRoute,
        public cssService: CSSService,
        router: Router,
        private authService: AuthService,
        poolRepository: PoolRepository,
        public favRepository: FavoritesRepository
    ) {
        super(route, router, poolRepository);
        this.translate = new TranslateService();
    }

    ngOnInit() {
        super.myNgOnInit(() => this.postNgOnInit());
    }

    postNgOnInit() {
        this.competitors = this.pool.getCompetitors();
        this.favorites = this.favRepository.getObject(this.pool);
        this.processing = false;
    }

    isAnAdmin(): boolean {
        return this.pool.getCompetitor(this.authService.getUser())?.getAdmin();
    }
}
