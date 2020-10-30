import { Injectable } from '@angular/core';

import { Pool } from '../pool';
import { JsonFavorites } from './json';

@Injectable()
export class FavoritesBackEnd {

    protected json: JsonFavorites[];
    protected identifier = 'favorites';

    constructor() { }

    get(pool: Pool): JsonFavorites {
        this.readAll();

        let jsonFavorites: JsonFavorites = this.find(pool.getId());
        if (jsonFavorites === undefined) {
            jsonFavorites = {
                poolId: pool.getId(),
                competitorIds: []
            };
        }
        return jsonFavorites;
    }

    post(jsonFavorites: JsonFavorites) {
        this.readAll();
        this.json.push(jsonFavorites);
        this.writeAll();
    }

    remove(poolId: number) {
        this.readAll();

        const oldItem = this.find(poolId);
        if (oldItem === undefined) {
            return;
        }
        const idx = this.json.indexOf(oldItem);
        if (idx >= 0) {
            this.json.splice(idx, 1);
        }

        this.writeAll();
    }

    protected find(poolId: number): JsonFavorites {
        return this.json.find(jsonFavorites => jsonFavorites.poolId === poolId);
    }

    protected readAll() {
        if (this.json) {
            return;
        }
        const favorites = localStorage.getItem(this.identifier);
        if (favorites === null) {
            this.json = [];
        }
        this.json = JSON.parse(favorites);
    }

    protected writeAll() {
        localStorage.setItem(this.identifier, JSON.stringify(this.json));
    }
}