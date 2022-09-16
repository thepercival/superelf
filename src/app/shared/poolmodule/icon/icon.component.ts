import { Component, Input } from '@angular/core';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

@Component({
    selector: 'app-superelf-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class SuperElfIconComponent {
    @Input() name!: CustomIconName;

    get prefix(): IconPrefix { return <IconPrefix>'fac'; }
    get iconName(): IconName { return <IconName>this.name; }
}

type CustomIconName = 'pine-cone' | 'super-cup' | 'structure';