import { Injectable } from '@angular/core';
import { AssociationMapper } from 'ngx-sport';
import { PoolCollection } from '../collection';

import { JsonPoolCollection } from './json';

@Injectable()
export class PoolCollectionMapper {
    constructor(protected associationMapper: AssociationMapper) { }

    toObject(json: JsonPoolCollection): PoolCollection {
        const collection = new PoolCollection(this.associationMapper.toObject(json.association, true));

        collection.setId(json.id);
        return collection;
    }

    toJson(collection: PoolCollection): JsonPoolCollection {
        return {
            id: collection.getId(),
            association: this.associationMapper.toJson(collection.getAssociation())
        };
    }
}
