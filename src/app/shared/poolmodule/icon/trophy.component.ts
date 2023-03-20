import { Component, Input } from '@angular/core';
import { IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { LeagueName } from '../../../lib/leagueName';

@Component({
    selector: 'app-superelf-trophy-icon',
    templateUrl: './trophy.component.html',
    styleUrls: ['./trophy.component.scss']
})
export class SuperElfTrophyIconComponent {
    @Input() leagueName!: LeagueName;
    @Input() size: SizeProp|undefined;    

    get prefix(): IconPrefix { 
        return <IconPrefix>'fac'; 
    }    

    get iconName(): IconName {
        switch (this.leagueName) {
            case LeagueName.Competition:
              return <IconName>'plate';
            case LeagueName.Cup:
                return <IconName>'cup';
            case LeagueName.SuperCup:
                return <IconName>'super-cup';
            case LeagueName.WorldCup:
                return <IconName>'world-cup';
        }
    }
    
    get color(): string { 
        return 'text-silver';
    }
}