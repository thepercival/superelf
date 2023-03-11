import { Injectable } from "@angular/core";
import { Pool } from "./pool";
import { PoolUser } from "./pool/user";

@Injectable({
    providedIn: 'root'
})
export class S11Storage {        

    getLatest(pool: Pool): GetAchievementsRequest|undefined {
        const achievementsRequestDates = this.getJson();
        const poolId = '' + pool.getId();

        const request = achievementsRequestDates.find( (request: GetAchievementsRequest): boolean => {
            return request.poolId === poolId;
        });
        if( request !== undefined) {
            request.date = new Date(request.date);
        }
        return request;
    }

    setLatest(pool: Pool, date: Date, has: boolean): void {
        const achievementsRequestDates = this.getJson();
        const poolId = '' + pool.getId();
        const request = achievementsRequestDates.find( (request: GetAchievementsRequest): boolean => {
            return request.poolId === poolId;
        });
        if( request !== undefined) {
            request.date = date;
            request.has = has;
        } else {
            achievementsRequestDates.push({poolId, date, has});
        }
        localStorage.setItem('achievementsRequestDates', JSON.stringify(achievementsRequestDates));
    }

    private getJson(): GetAchievementsRequest[] {
        let stringFromStorage = localStorage.getItem('achievementsRequestDates');
        if( stringFromStorage === null) {
            stringFromStorage = '[]';
            localStorage.setItem('achievementsRequestDates', stringFromStorage);    
        }        
        return JSON.parse(stringFromStorage);
    }
}

interface GetAchievementsRequest{
    poolId: string;
    date: Date;
    has: boolean;
}