import { Favorites } from '../favorites';
import { Pool } from '../pool';
import { JsonFavorites } from './json';

export class FavoritesMapper {
    constructor() { }

    toObject(json: JsonFavorites, pool: Pool): Favorites {

        const favorites = new Favorites(pool);
        json.competitorIds.forEach(competitorId => {
            const competitor = pool.getCompetitors().find(competitorIt => {
                return competitorIt.getId() === competitorId;
            });
            if (competitor) {
                favorites.addCompetitor(competitor);
            }
        });

        return favorites;
    }

    toJson(favorites: Favorites): JsonFavorites {
        return {
            poolId: favorites.getPool().getId(),
            competitorIds: favorites.getPool().getCompetitors().map(competitor => {
                return +competitor.getId();
            })
        };
    }
}