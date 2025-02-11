import { Component, EventEmitter, Output, input } from '@angular/core';
import { AgainstRuleSet, NameService } from 'ngx-sport';

@Component({
    selector: 'app-ranking-rules',
    templateUrl: './rankingrules.component.html',
    styleUrls: ['./rankingrules.component.scss']
})
export class RankingRulesComponent {
    readonly againstRuleSet = input.required<AgainstRuleSet>();
    readonly editMode = input<boolean>(false);
    @Output() changed = new EventEmitter<AgainstRuleSet>();

    protected nameService: NameService;

    constructor() {
        this.nameService = new NameService();
    }

    getDescription(): string[] {
        return this.nameService.getRulesName(this.againstRuleSet());
    }
}
