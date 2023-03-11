import { Component, Input } from '@angular/core';
import { IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { LeagueName } from '../../../lib/leagueName';
import { FootballCard, FootballEvent, FootballGoal } from '../../../lib/score';

@Component({
    selector: 'app-superelf-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class SuperElfIconComponent {
    @Input() name: CustomIconName | undefined;
    @Input() leagueName: LeagueName | undefined;
    @Input() gameEvent: FootballEvent | undefined;
    @Input() large: boolean = false;
    @Input() size: SizeProp|undefined;

    get color(): string { 
        if( this.gameEvent === undefined ) {
            return ''; 
        }
        return this.getColorFromFootballEvent(this.gameEvent);
    }

    get prefix(): IconPrefix { 
        if( this.name || this.leagueName ) {
            return <IconPrefix>'fac'; 
        }
        switch (this.gameEvent) {
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

    // get sizeTimes(): string {
    //     return this.sizeX ? this.sizeX + '' : '';
    // }

    get iconName(): IconName { 
        if( this.leagueName !== undefined) {
            return <IconName>this.getNameFromLeagueName(this.leagueName);
        }
        else if( this.gameEvent !== undefined) {
            return <IconName>this.getNameFromFootballEvent(this.gameEvent);
        }
        return <IconName>this.name; 
    }

    private getNameFromLeagueName(leagueName: LeagueName): CustomIconName {
        switch (leagueName) {
            case LeagueName.Competition:
              return 'plate';
            case LeagueName.Cup:
                return 'cup';
            case LeagueName.SuperCup:
                return 'super-cup';
            case LeagueName.WorldCup:
                return 'world-cup';
        }
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

    // private getRotateFromFootballEvent(event: FootballEvent): boolean {
    //     switch (event) {
    //         case FootballCard.Red:
    //         case FootballCard.Yellow:                
    //             return true;
    //     }
    //     return false;
    // }
}

export type CustomIconName = 'cup' | 'super-cup' | 'structure' | 'trophy' | 'plate' | 
'clean-sheet' | 'world-cup' | 'crown' | 'spotty-sheet' | 'card' | 'penalty';