import { Component, input } from '@angular/core';
import { IconDefinition, IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
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
    readonly icon = input.required<IconDefinition>();
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

    get rotate(): boolean { 
        return false;
        // if( this.gameEvent === undefined ) {
        //     return false;
        // }
        // return this.getRotateFromFootballEvent(this.gameEvent);
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

// export type CustomDefintion = facCup | 'super-cup' | 'structure' | 'trophy' | 'plate' | 
// 'clean-sheet' | 'world-cup' | 'crown' | 'spotty-sheet' | 'card' | 'penalty';