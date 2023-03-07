import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class S11Storage {
    private latestGetAchievementsRequestId = 'latestGetAchievementsRequestId';

    getLatestGetAchievementsRequest(): Date|undefined {
        const stringFromStorage = localStorage.getItem(this.latestGetAchievementsRequestId);
        if( stringFromStorage === null) {
            return undefined;
        }
        const valueFromStorage = JSON.parse(stringFromStorage);
        return new Date(valueFromStorage.date);
    }

    setLatestGetAchievementsRequest(date: Date): void {
        const request: LatestGetAchievementsRequest = {date}
        localStorage.setItem(this.latestGetAchievementsRequestId, JSON.stringify(request));
    }    
}

interface LatestGetAchievementsRequest{
    date: Date;
}