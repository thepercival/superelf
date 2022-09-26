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
import { DateFormatter } from '../../lib/dateFormatter';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { LeagueName } from '../../lib/leagueName';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { GameState, Poule, Round, Structure, StructureCell } from 'ngx-sport';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';

@Component({
    selector: 'app-pool-public',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends PoolComponent implements OnInit {
    public translate: TranslateService;
    public scoutedPlayers: ScoutedPlayer[] = [];
    public scoutingEnabled: boolean = false;
    public poolUsers: PoolUser[] = [];
    public currentGameRoundNumbers: CurrentGameRoundNumbers | undefined;
    public cupStructure: Structure | undefined;

    constructor(
        route: ActivatedRoute,
        router: Router,
        poolRepository: PoolRepository,
        globalEventsManager: GlobalEventsManager,
        public cssService: CSSService,
        private dateFormatter: DateFormatter,
        private poolUserRepository: PoolUserRepository,
        protected scoutedPlayerRepository: ScoutedPlayerRepository,
        protected gameRoundRepository: GameRoundRepository,
        protected structureRepository: StructureRepository,
        protected modalService: NgbModal
    ) {
        super(route, router, poolRepository, globalEventsManager);
        this.translate = new TranslateService();
    }

    ngOnInit() {
        super.parentNgOnInit().subscribe({
            next: (pool: Pool) => {
                this.setPool(pool);
                this.postNgOnInit(pool);
            },
            error: (e) => {
                this.setAlert('danger', e); this.processing = false;
            }
        });
    }

    postNgOnInit(pool: Pool) {
        const competitionConfig = pool.getCompetitionConfig();
        this.scoutingEnabled = pool.getCreateAndJoinPeriod().isIn() || pool.getAssemblePeriod().isIn();
        if (this.scoutingEnabled) {
            // const viewPeriod = pool.getAssembleViewPeriod();
            const competition = this.pool.getSourceCompetition();
            this.scoutedPlayerRepository.getObjects(competition, pool.getCreateAndJoinPeriod()).subscribe((scoutedPlayers: ScoutedPlayer[]) => {
                this.scoutedPlayers = scoutedPlayers;
            });
        }

        this.poolUserRepository.getObjectFromSession(pool)
            .subscribe({
                next: (poolUser: PoolUser | undefined) => {
                    this.poolUser = poolUser;
                    // console.log('ssss', this.poolUser);
                    if (pool.getCreateAndJoinPeriod().isIn() || pool.getAssemblePeriod().isIn()) {
                        this.poolUserRepository.getObjects(pool).subscribe((poolUsers: PoolUser[]) => {
                            this.poolUsers = poolUsers;
                            this.initCupStructure();
                        });
                    }
                    if (this.afterAssemblePeriod()) {
                        this.gameRoundRepository.getCurrentNumbers(competitionConfig, this.currentViewPeriod).subscribe({
                            next: (currentGameRoundNumbers: CurrentGameRoundNumbers) => {
                                this.currentGameRoundNumbers = currentGameRoundNumbers;
                            },
                            error: (e: string) => { this.setAlert('danger', e); this.processing = false; },
                            complete: () => this.processing = false
                        });
                    } else {
                        this.processing = false;
                    }

                },
                error: (e: string) => {
                    this.setAlert('danger', e); this.processing = false;
                }
            });

    }

    initCupStructure(): void {
        const cup = this.pool.getCompetition(LeagueName.Cup);
        if (cup === undefined) {
            return;
        }
        this.structureRepository.getObject(cup).subscribe({
            next: (structure: Structure) => {
                this.cupStructure = structure;
            },
            error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
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

    getCompetitionCompetitors(): PoolCompetitor[] {
        return this.pool.getCompetitors(LeagueName.Competition);
    }

    getCupCompetitors(): PoolCompetitor[] {
        return this.pool.getCompetitors(LeagueName.Cup);
    }

    openModal(modalContent: TemplateRef<any>) {
        const activeModal = this.modalService.open(modalContent);
        activeModal.result.then(() => {
        }, () => {
        });
    }

    get LeagueNameCompetition(): LeagueName { return LeagueName.Competition };
    get LeagueNameCup(): LeagueName { return LeagueName.Cup };
    get LeagueNameSuperCup(): LeagueName { return LeagueName.SuperCup };

    getBorderClass(leagueName: LeagueName): string {
        const competition = this.pool.getCompetition(leagueName);
        if (competition === undefined) {
            return 'border-zero';
        }
        return leagueName === LeagueName.Competition || (leagueName === LeagueName.SuperCup && this.pool.getName() === 'kamp duim') ? 'border-positive' : 'border-zero';
    }

    getPointer(leagueName: LeagueName): string {
        return leagueName === LeagueName.Competition || (leagueName === LeagueName.SuperCup && this.pool.getName() === 'kamp duim') ? 'pointer' : '';
    }

    linkToSuperCupOrCup(leagueName: LeagueName): void {
        const competition = this.pool.getCompetition(leagueName);
        if (competition === undefined) {
            return;
        }
        if (leagueName === LeagueName.SuperCup) {
            this.router.navigate(['/pool/poule', this.pool.getId(), leagueName, 0]);
            return;
        }
        if (this.poolUser === undefined) {
            return;
        }
        const currentPoule = this.getCurrentCupPoule(this.poolUser);
        if (currentPoule !== undefined) {
            this.router.navigate(['/pool/poule', this.pool.getId(), leagueName, currentPoule.getId()]);
        } else {
            this.router.navigate(['/pool/cup', this.pool.getId()]);
        }
    }

    getCurrentCupPoule(poolUser: PoolUser): Poule | undefined {
        if (this.cupStructure === undefined) {
            return undefined;
        }
        const competitor = poolUser.getCompetitor(LeagueName.Cup)
        if (competitor === undefined) {
            return undefined;
        }
        const structureCell = this.getCurrentStructureCell(this.cupStructure.getSingleCategory().getFirstStructureCell());
        return structureCell.getPoules().find((poule: Poule): boolean => {
            return poule.getPlaceByStartLocation(competitor.getStartLocation()) !== undefined;
        });

    }

    getCurrentStructureCell(structureCell: StructureCell): StructureCell {
        const gamesState = structureCell.getGamesState();
        if (gamesState !== GameState.Finished) {
            return structureCell;
        }
        const nextStructureCell = structureCell.getNext();
        if (nextStructureCell === undefined) {
            return structureCell;
        }
        return this.getCurrentStructureCell(nextStructureCell);
    }

    // getNrOfPoolUsersHaveTransfered(): number {
    //     const max = this.pool.getTransferPeriod().getMaxNrOfTransfers();
    //     return this.poolUsers.filter(poolUser => poolUser.getNrOfTransferedWithTeam() === max).length;
    // }

    // allPoolUsersHaveTransfered(): boolean {
    //     return this.poolUsers.length === this.getNrOfPoolUsersHaveTransfered();
    // }

    linkToAssemble() {
        if (!this.inAssembleMode()) {
            return;
        }
        if (this.poolUser?.getAssembleFormation() !== undefined) {
            this.router.navigate(['/pool/formation/assemble', this.pool.getId()]);
        } else {
            this.router.navigate(['/pool/formation/choose', this.pool.getId()]);
        }
    }

    showAssemble(): boolean {
        const now = new Date();
        return this.pool.getAssemblePeriod().isIn();
    }

    inAssembleMode(): boolean {
        return this.pool.getAssemblePeriod().isIn();
    }

    inBeforeStart(pool: Pool): boolean {
        return pool.getStartDateTime().getTime() > (new Date()).getTime();
    }

    inBeforeAssemble(): boolean {
        return this.pool.getAssemblePeriod().getStartDateTime().getTime() > (new Date()).getTime();
    }

    getStartAssembleDate(): string {
        return 'vanaf ' + this.dateFormatter.toString(this.pool.getAssemblePeriod().getStartDateTime(), this.dateFormatter.niceDateTime()) + ' uur';
    }

    getNrAssembled(): number {
        return (this.poolUser?.getNrOfAssembled() ?? 0);
    }

    afterAssemblePeriod(): boolean {
        return this.pool.getAssemblePeriod().getEndDateTime().getTime() < (new Date()).getTime();
    }
}
