import { Component, input } from '@angular/core';
import { IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { LeagueName } from '../../../lib/leagueName';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    standalone: true,
    imports: [FontAwesomeModule],
    selector: 'app-superelf-trophy-icon',
    templateUrl: './trophy.component.html',
    styleUrls: ['./trophy.component.scss']
})
export class SuperElfTrophyIconComponent {
    readonly leagueName = input.required<LeagueName>();
    readonly size = input<SizeProp>();    

    get prefix(): IconPrefix { 
        return <IconPrefix>'fac'; 
    }    

    get iconName(): IconName {
        switch (this.leagueName()) {
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