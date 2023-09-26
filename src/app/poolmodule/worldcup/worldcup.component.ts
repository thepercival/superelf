import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { concatMap } from 'rxjs';
import { WorldCupPreviousService } from '../../shared/commonmodule/worldCupPreviousService';

@Component({
    selector: 'app-pool-worldcup',
    templateUrl: './worldcup.component.html',
    styleUrls: ['./worldcup.component.css']
})
export class WorldCupComponent implements OnInit {
    
    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected poolRepository: PoolRepository,
        protected worldCupPreviousService: WorldCupPreviousService
    ) {
        
    }

    ngOnInit() {
        this.route.params.pipe(
            concatMap(params => {
                let originPoolId: number|undefined = +params.originPoolId;
                if (originPoolId === 0 ) {
                    originPoolId = undefined;
                }   
                this.worldCupPreviousService.setPreviousPoolId(originPoolId);
                return this.poolRepository.getWorldCupId(+params.seasonId);
            }),
        ).subscribe({
            next: (worldCupPoolId: number) => {
                this.router.navigate(['/pool', worldCupPoolId]);
            }
        });
        
    }
}
