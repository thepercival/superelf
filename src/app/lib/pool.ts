import { Competition, Competitor, PlaceRange, Season } from 'ngx-sport';

import { PoolCompetitor } from './competitor';
import { PoolCollection } from './pool/collection';
import { User } from './user';

export class Pool {
    protected id: number;
    protected competitions: Competition[] = [];
    protected competitors: PoolCompetitor[] = [];

    public static LeagueSuperCup: string = 'SuperCup';
    static readonly PlaceRanges: PlaceRange[] = [
        { min: 1, max: 1, placesPerPoule: { min: 2, max: 40 } }
    ];

    constructor(protected collection: PoolCollection, protected season: Season) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getCollection(): PoolCollection {
        return this.collection;
    }

    getSeason(): Season {
        return this.season;
    }

    setSeason(season: Season): void {
        this.season = season;
    }

    // setRoles(roles: Role[]): void {
    //     this.roles = roles;
    // }

    getName(): string {
        return this.getCollection().getName();
    }

    getCompetitions(): Competition[] {
        return this.competitions;
    }

    getCompetitors(competition?: Competition): PoolCompetitor[] {
        if (competition === undefined) {
            return this.competitors;
        }
        return this.competitors.filter(competitor => competitor.getCompetition() === competition);
    }

    getCompetitor(user: User): PoolCompetitor {
        return this.competitors.find(competitor => competitor.getUser() === user);
    }

    getCompetitorNames(competition?: Competition): string[] {
        return this.getCompetitors(competition).map(competitor => competitor.getName());
    }
}
