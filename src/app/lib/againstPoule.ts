import { AgainstSide, AgainstSportRoundRankingCalculator, GameState, Poule, SportRoundRankingItem, StartLocationMap } from 'ngx-sport';
import { PoolCompetitor } from './pool/competitor';

export class AgainstPoule {

    public homeCompetitor: PoolCompetitor | undefined;
    public awayCompetitor: PoolCompetitor | undefined;
    private sportRankingItems: SportRoundRankingItem[];

    constructor(private poule: Poule, private startLocationMap: StartLocationMap) {
        const competitionSport = poule.getCompetition().getSingleSport();
        const rankingCalculator = new AgainstSportRoundRankingCalculator(competitionSport, [GameState.Finished]);
        this.sportRankingItems = rankingCalculator.getItemsForPoule(poule);

        const homeStartLocation = this.poule.getPlace(1).getStartLocation();
        if (homeStartLocation) {
          this.homeCompetitor = <PoolCompetitor>this.startLocationMap.getCompetitor(homeStartLocation);
        }
        if( this.poule.getPlaces().length === 2) {
            const awayStartLocation = this.poule.getPlace(2).getStartLocation();
            if (awayStartLocation) {
                this.awayCompetitor = <PoolCompetitor>this.startLocationMap.getCompetitor(awayStartLocation);
            }
        }
    }

    public getCompetitor(side: AgainstSide): PoolCompetitor|undefined {
        return side === AgainstSide.Home ? this.homeCompetitor : this.awayCompetitor;
    }

    hasRankingScore(): boolean {
        return this.poule.getGamesState() === GameState.InProgress || this.poule.getGamesState() === GameState.Finished;
    }

    getScore(side: AgainstSide): string {
        const sportRankingItem = this.getSportRankingItem(this.getCompetitor(side));
        if (sportRankingItem === undefined) {
          return '';
        }
        const performance = sportRankingItem.getPerformance();
        if (performance === undefined) {
          return '';
        }
        return '' + performance.getPoints();
    }

    public hasQualified(side: AgainstSide): boolean {
        if( this.poule.getGamesState() !== GameState.Finished ) {
            return false;
        }
        const oppositeSide = side === AgainstSide.Home ? AgainstSide.Away : AgainstSide.Home

        const sportRankingItem = this.getSportRankingItem(this.getCompetitor(side));
        const opposite = this.getSportRankingItem(this.getCompetitor(oppositeSide));
        if( sportRankingItem === undefined || opposite === undefined) {
            return false;
        }
        return sportRankingItem.getUniqueRank() < opposite.getUniqueRank();
    }

    private getSportRankingItem(poolCompetitor: PoolCompetitor | undefined): SportRoundRankingItem | undefined {
        if( poolCompetitor === undefined) {
            return undefined;
        }
        const placeNr = poolCompetitor.getStartLocation().getPlaceNr();
        return this.sportRankingItems.find((sportRankingItem: SportRoundRankingItem) => sportRankingItem.getPlaceLocation().getPlaceNr() === placeNr );
    } 
    

}
