import { Injectable } from '@angular/core';

import { Pool } from '../pool';
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

    getObject(pool: Pool): Favorites {
        return this.mapper.toObject(this.backend.get(pool), pool);
    }

    editObject(favorites: Favorites) {

        this.backend.remove(favorites.getPool().getId());
        this.backend.post(this.mapper.toJson(favorites));
    }
}
