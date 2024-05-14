import { Injectable } from '@angular/core';
import { FootballLine, HorizontalMultipleQualifyRule, HorizontalPoule, HorizontalSingleQualifyRule, Place, QualifyGroup, QualifyTarget, Round, VerticalMultipleQualifyRule, VerticalSingleQualifyRule} from 'ngx-sport';
import { LeagueName } from '../../lib/leagueName';
import { CustomIconName } from '../poolmodule/icon/icon.component';

@Injectable({
    providedIn: 'root'
})
export class CSSService {

    getQualifyPlace(place: Place): string {
        const horPouleWinners = place.getHorizontalPoule(QualifyTarget.Winners);
        const horPouleLosers = place.getHorizontalPoule(QualifyTarget.Losers);

        const winnersRule = horPouleWinners.getQualifyRuleNew();
        const losersRule = horPouleLosers.getQualifyRuleNew();

        if (winnersRule !== undefined && losersRule !== undefined) {
            const partialWinners = (winnersRule instanceof VerticalMultipleQualifyRule
                || winnersRule instanceof HorizontalMultipleQualifyRule);
            const partialLosers = (losersRule instanceof VerticalMultipleQualifyRule
                || losersRule instanceof HorizontalMultipleQualifyRule);
            if (partialWinners && partialLosers) {
                return 'q-partial q-w-' + this.getQualifyGroupNumber(winnersRule.getGroup()) + '-double-partial q-l-'
                    + this.getQualifyGroupNumber(losersRule.getGroup()) + '-double-partial';
            } else if (!partialWinners) {
                return 'q-w-' + this.getQualifyGroupNumber(winnersRule.getGroup());
            }
            return 'q-l-' + this.getQualifyGroupNumber(losersRule.getGroup());
        } else if (winnersRule !== undefined) {
            return this.getQualifyRuleClasses(winnersRule);
        } else if (losersRule !== undefined) {
            return this.getQualifyRuleClasses(losersRule);
        }
        return '';
    }

    protected getQualifyGroupNumber(qualifyGroup: QualifyGroup): number {
        return qualifyGroup.getNumber() > 4 ? 5 : qualifyGroup.getNumber();
    }

    getQualifyPoule(horPoule: HorizontalPoule): string {
        const qualifyRule = horPoule.getQualifyRuleNew();
        if (qualifyRule === undefined) {
            return '';
        }
        return this.getQualifyRuleClasses(qualifyRule);
    }

    getQualifyRuleClasses(
        rule: VerticalSingleQualifyRule | VerticalMultipleQualifyRule | HorizontalSingleQualifyRule | HorizontalMultipleQualifyRule,
    ): string {
        const classes = (rule instanceof VerticalMultipleQualifyRule
            || rule instanceof HorizontalMultipleQualifyRule) ? 'q-partial' : '';
        return classes + this.getQualifyGroup(rule.getGroup());
    }

    getQualifyGroup(qualifyGroup: QualifyGroup): string {
        return ' q-' + qualifyGroup.getTarget().toLowerCase() + '-' + this.getQualifyGroupNumber(qualifyGroup);
    }

    getQualifyRound(round: Round, noQualifyClass: string = ''): string {
        const qualifyGroup: QualifyGroup | undefined = round.getParentQualifyGroup();
        if (qualifyGroup === undefined) {
            return noQualifyClass;
        }
        return ' q-' + (qualifyGroup.getTarget() === QualifyTarget.Winners ? 'w' : 'l') + '-' +
            this.getQualifyGroupNumber(qualifyGroup);
    }

    // getWinnersOrLosers(winnersOrLosers: number): string {
    //     return winnersOrLosers === QualifyGroup.WINNERS ? 'success' : (winnersOrLosers === QualifyGroup.LOSERS ? 'danger' : '');
    // }

    getLine(line: FootballLine, prefix: string = 'bg-'): string {
        return prefix + 'line-' + line;
    }

    getIconName(leagueName: LeagueName): CustomIconName {
        return leagueName === LeagueName.Cup ? 'cup' : 'super-cup';
    }


}
