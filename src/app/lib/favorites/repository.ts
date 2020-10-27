import { Injectable } from '@angular/core';

import { Tournament } from '../pool';
import { Favorites } from '../favorites';
import { FavoritesMapper } from './mapper';
import { FavoritesBackEnd } from './backend';

@Injectable()
export class FavoritesRepository {

    protected backend: FavoritesBackEnd;
    protected mapper: FavoritesMapper;

    constructor() {
        this.backend = new FavoritesBackEnd();
        this.mapper = new FavoritesMapper();
    }

    getObject(tournament: Tournament): Favorites {
        return this.mapper.toObject(this.backend.get(tournament), tournament);
    }

    editObject(favorites: Favorites) {

        this.backend.remove(favorites.getTournament().getId());
        this.backend.post(this.mapper.toJson(favorites));
    }
}
