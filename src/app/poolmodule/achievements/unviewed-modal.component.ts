import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClickMode, Container, Engine, HoverMode, MoveDirection, OutMode } from 'tsparticles-engine';
import { Badge } from '../../lib/achievement/badge';
import { Trophy } from '../../lib/achievement/trophy';
import { SuperElfNameService } from '../../lib/nameservice';
import { loadFull } from "tsparticles";
import { loadConfettiPreset } from 'tsparticles-preset-confetti';

@Component({
    selector: 'app-ngbd-modal-unviewed',
    templateUrl: './unviewed-modal.component.html',
    styleUrls: ['./unviewed-modal.component.scss']
})
export class UnviewedAchievementsModalComponent implements OnInit {
    @Input() achievements!: (Trophy|Badge)[];
    
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
        const achievements = this.achievements.slice();
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
        if( this.achievements.length === 1 ) {
            return '1 nieuwe prijs';
        }
        return this.achievements.length + ' nieuwe prijzen';
    }
}

