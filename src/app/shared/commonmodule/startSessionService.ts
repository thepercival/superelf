import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class StartSessionService {
    private storageId: string = 'activateSessionAction';

    constructor(private router: Router) {

    }

    public navigate(): void {
        const nextAction = this.clearNextAction();

        if (nextAction !== undefined && !this.hasExpired(nextAction)) {

            if (nextAction.action === 'create') {
                this.router.navigate(['/pool/new']);
            } else if (nextAction.joinPoolId && nextAction.joinKey) {
                this.router.navigate(['/pool/join', nextAction.joinPoolId, nextAction.joinKey]);
            }
        } else {
            this.router.navigate(['/']);
        }
    }

    private hasExpired(action: ActivateSessionAction): boolean {
        const yesterday = (new Date()).getTime() - (24 * 60 * 60 * 1000);
        return action.createdDate.getTime() < yesterday;
    }

    public setCreateAction(): void {
        const nextAction = this.getNextActionFromStorage();
        if (nextAction && !this.hasExpired(nextAction) && nextAction.action === 'join') {
            return;
        }
        const action: ActivateSessionAction = {
            action: 'create',
            createdDate: new Date()
        }
        localStorage.setItem(this.storageId, JSON.stringify(action));
    }

    public setJoinAction(poolId: number, key: number): void {
        const action: ActivateSessionAction = {
            action: 'join',
            joinPoolId: poolId,
            joinKey: key,
            createdDate: new Date()
        }
        localStorage.setItem(this.storageId, JSON.stringify(action));
    }

    public clearNextAction(): ActivateSessionAction | undefined {
        const value = this.getNextActionFromStorage();
        localStorage.removeItem(this.storageId);
        return value;
    }

    private getNextActionFromStorage(): ActivateSessionAction | undefined {
        let stringFromStorage = localStorage.getItem(this.storageId);
        console.log(stringFromStorage, stringFromStorage ? JSON.parse(stringFromStorage) : undefined);
        if (stringFromStorage === null) {
            return undefined;
        }
        const valueFromStorage = JSON.parse(stringFromStorage);
        if (valueFromStorage === null) {
            return undefined;
        }
        valueFromStorage.createdDate = new Date(valueFromStorage.createdDate);
        return valueFromStorage;
    }
}

interface ActivateSessionAction {
    action: 'create' | 'join';
    joinPoolId?: number | undefined;
    joinKey?: number | undefined;
    createdDate: Date;
}