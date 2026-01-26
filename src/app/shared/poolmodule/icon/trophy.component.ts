import { Component, input } from '@angular/core';
import { IconDefinition, IconName, IconPrefix, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { LeagueName } from '../../../lib/leagueName';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { facCup, facPlate, facSuperCup, facWorldCup } from '../icons';

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
    readonly class = input<string>();

    public getIconDefinition(): IconDefinition {
        switch (this.leagueName()) {
            case LeagueName.Competition:
              return facPlate;
            case LeagueName.Cup:
                return facCup;
            case LeagueName.SuperCup:
                return facSuperCup;
            case LeagueName.WorldCup:
                return facWorldCup;
        }
    }
}