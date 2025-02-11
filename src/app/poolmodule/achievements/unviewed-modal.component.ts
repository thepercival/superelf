import { Component, OnInit, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Container, Engine } from 'tsparticles-engine';
import { Badge } from '../../lib/achievement/badge';
import { Trophy } from '../../lib/achievement/trophy';
import { SuperElfNameService } from '../../lib/nameservice';
import { loadConfettiPreset } from 'tsparticles-preset-confetti';
import { LeagueName } from '../../lib/leagueName';

@Component({
    selector: 'app-ngbd-modal-unviewed',
    templateUrl: './unviewed-modal.component.html',
    styleUrls: ['./unviewed-modal.component.scss']
})
export class UnviewedAchievementsModalComponent implements OnInit {
    readonly achievements = input.required<(Trophy | Badge)[]>();
    
    public previousAchievements: (Trophy|Badge)[] = [];
    public current: Trophy|Badge|undefined;
    public nextAchievements: (Trophy|Badge)[] = [];
    public currentTrophy: Trophy|undefined;
    public currentBadge: Badge|undefined;

    private container: Container|undefined;

    constructor(
        public modal: NgbActiveModal,
        public nameService: SuperElfNameService) {
    }

    ngOnInit() {
        const achievements = this.achievements().slice().reverse();

        // console.log(achievements);
        const current = achievements.pop(); 
        if( current !== undefined) {
            this.setCurrent(current);        
        }
        this.nextAchievements = achievements;
        
    }

    previous() {
        const previous = this.previousAchievements.pop();
        if( previous === undefined) {
            return;
        }
        if( this.current ) {
            this.nextAchievements.unshift(this.current);
        }
        this.setCurrent(previous);
        if( this.container ) {            
            this.container.refresh();
        }
    }

    next() {
        const next = this.nextAchievements.shift();
        if( next === undefined) {
            return;
        }
        if( this.current ) {
            this.previousAchievements.push(this.current);
        }
        this.setCurrent(next);
        if( this.container ) {            
            this.container.refresh();
        }
    }

    setCurrent(achievement: Trophy|Badge) {
        this.current = achievement;
        if( achievement instanceof Trophy) {
            this.currentTrophy = achievement;
            this.currentBadge = undefined;
        } else {
            this.currentTrophy = undefined;
            this.currentBadge = achievement;
        }
    }

    
    getTrophyTitle(trophy: Trophy): string {
        let leagueName = trophy.getCompetition().getLeague().getName();
        let seasonName = trophy.getCompetition().getSeason().getName();
        switch (leagueName) {
            case LeagueName.Competition:
                leagueName = 'Competitie';
                break;
            case LeagueName.Cup:
                leagueName = 'Beker';
                break;
            case LeagueName.SuperCup:
                leagueName = 'Super Cup';
        }
        return leagueName + ' ' + seasonName.replace('20', '').replace('20', '');
    }

    public tsparticlesId = "tsparticles";

    public particlesOptions = {
        fpsLimit: 120,
        preset: "confetti"
    }


    particlesLoaded(container: Container): void {
        if( this.container === undefined) {
            this.container = container;
        }
    }

    async particlesInit(engine: Engine): Promise<void> {

        await loadConfettiPreset(engine);
    }
    
    getHeader(): string {
        const achievements = this.achievements();
        if( achievements.length === 1 ) {
            return '1 nieuwe prijs';
        }
        return achievements.length + ' nieuwe prijzen';
    }
}

