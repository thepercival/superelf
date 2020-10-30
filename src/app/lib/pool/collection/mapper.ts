import { Injectable } from '@angular/core';
import { PoolCollection } from '../collection';

import { JsonPoolCollection } from './json';

@Injectable()
export class PoolCollectionMapper {
    constructor() { }

    toObject(json: JsonPoolCollection): PoolCollection {
        const collection = new PoolCollection(json.name);

        collection.setId(json.id);
        return collection;
    }

    toJson(collection: PoolCollection): JsonPoolCollection {
        return {
            id: collection.getId(),
            name: collection.getName()
        };
    }
}
