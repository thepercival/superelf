import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WorldCupPreviousService {
    private previousPoolId: number|undefined;
    
    public getPreviousPoolId(): number | undefined {
        return this.previousPoolId;
    }

    public setPreviousPoolId(poolId: number | undefined): void {
        this.previousPoolId = poolId;
    }
}
