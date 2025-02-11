import { Component, input } from '@angular/core';
import { IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FootballCard, FootballEvent, FootballGoal } from '../../../lib/score';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    standalone: true,
    imports: [FontAwesomeModule],
    selector: 'app-superelf-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class SuperElfIconComponent {
    readonly name = input<CustomIconName>();
    readonly gameEvent = input<FootballEvent>();
    readonly large = input<boolean>(false);
    readonly size = input<SizeProp>();

    get color(): string { 
        const gameEvent = this.gameEvent();
        if( gameEvent === undefined ) {
            return ''; 
        }
        return this.getColorFromFootballEvent(gameEvent);
    }

    get prefix(): IconPrefix { 
        if( this.name() ) {
            return <IconPrefix>'fac'; 
        }
        switch (this.gameEvent()) {
            case FootballCard.Yellow:                
            case FootballCard.Red:
                return <IconPrefix>'fac';
        }
        return 'fas';
    }

    get rotate(): boolean { 
        return false;
        // if( this.gameEvent === undefined ) {
        //     return false;
        // }
        // return this.getRotateFromFootballEvent(this.gameEvent);
    }

    get iconName(): IconName { 
        const gameEvent = this.gameEvent();
        if( gameEvent !== undefined) {
            return <IconName>this.getNameFromFootballEvent(gameEvent);
        }
        return <IconName>this.name(); 
    }

    private getNameFromFootballEvent(event: FootballEvent): CustomIconName | IconName {
        switch (event) {
            case FootballGoal.Normal:
            case FootballGoal.Own:
                return 'futbol';
            case FootballGoal.Assist:
                return 'futbol';                
            case FootballGoal.Penalty:
                return 'futbol';
            case FootballCard.Yellow:                
            case FootballCard.Red:
                return 'card';
        }
    }

    private getColorFromFootballEvent(event: FootballEvent): string {
        switch (event) {
            case FootballGoal.Own:            
            case FootballCard.Red:
                return 'text-danger';
            case FootballCard.Yellow:                
                return 'text-yellow'
        }
        return '';
    }
}

export type CustomIconName = 'cup' | 'super-cup' | 'structure' | 'trophy' | 'plate' | 
'clean-sheet' | 'world-cup' | 'crown' | 'spotty-sheet' | 'card' | 'penalty';