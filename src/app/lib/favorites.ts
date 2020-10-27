import { Game, Referee, Competitor, Place } from 'ngx-sport';
import { PlaceLocationMap } from 'ngx-sport';
import { Pool } from './pool';

export class Favorites {

    protected placeLocationMap: PlaceLocationMap;

    constructor(
        private pool: Pool,
        private competitors: Competitor[] = [],
    ) {
        this.placeLocationMap = new PlaceLocationMap(pool.getCompetitors());
    }

    getPool(): Pool {
        return this.pool;
    }

    hasCompetitors(): boolean {
        return this.competitors.length > 0;
    }

    hasCompetitor(competitor: Competitor): boolean {
        if (competitor === undefined) {
            return false;
        }
        return this.competitors.find(competitorIt => competitorIt === competitor) !== undefined;
    }

    getNrOfCompetitors(): number {
        return this.competitors.length;
    }

    hasGameCompetitor(game: Game, homeaway?: boolean): boolean {
        return game.getPlaces(homeaway).some(gamePlace => {
            const competitor = this.placeLocationMap.getCompetitor(gamePlace.getPlace().getStartLocation());
            return competitor && this.hasCompetitor(competitor);
        });
    }

    addCompetitor(competitor: Competitor) {
        if (this.hasCompetitor(competitor)) {
            return;
        }
        this.competitors.push(competitor);
    }

    removeCompetitor(competitor: Competitor) {
        if (this.hasCompetitor(competitor) === false) {
            return;
        }
        this.competitors.splice(this.competitors.indexOf(competitor), 1);
    }

    filterCompetitors(competitors: Competitor[]): Competitor[] {
        return competitors.filter(competitor => this.hasCompetitor(competitor));
    }

    protected getCompetitorFromPlace(place: Place): Competitor {
        if (!place) {
            return undefined;
        }
        return this.placeLocationMap.getCompetitor(place.getStartLocation());
    }
}