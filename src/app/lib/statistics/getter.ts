import { GameState } from "ngx-sport";
import { S11Formation } from "../formation";
import { S11FormationLine } from "../formation/line";
import { S11FormationPlace } from "../formation/place";
import { GameRound } from "../gameRound";
import { S11Player } from "../player";
import { PointsCalculator } from "../points/calculator";
import { Statistics } from "../statistics";


export class StatisticsGetter {

    constructor() {    }

    private personMap: Map<string|number, StatisticsMap> = new Map();

    getFormationPoints(formation: S11Formation, gameRound: GameRound|number): number {
        let points = 0;
        for (let line of formation.getLines()) {
            points += this.getFormationLinePoints(line, gameRound);
        }
        return points;
    }

    getFormationLinePoints(formationLine: S11FormationLine, gameRound: GameRound|number): number {
        let points = 0;
        for (let place of formationLine.getPlaces()) {
            points += this.getFormationPlacePoints(place, gameRound);
        }
        return points;
    }

    getFormationPlacePoints(formationPlace: S11FormationPlace, gameRound: GameRound | number): number {
        const player = formationPlace.getPlayer();
        if (player === undefined) {
            return 0;
        }

        const statistics = this.getStatistics(player, gameRound);
        if (statistics === undefined) {
            return 0;
        }
        const formationLine = formationPlace.getFormationLine();
        if (formationPlace.isSubstitute() && !formationLine.hasSubstituteAppareance(gameRound)) {
            return 0;
        }
        const competitionConfig = formationLine.getFormation().getPoolUser().getPool().getCompetitionConfig();
        return (new PointsCalculator(competitionConfig)).getPoints(formationPlace.getLine(), statistics);
    }

    placeHasStatistics(formationPlace: S11FormationPlace, gameRound: GameRound): boolean {
        const player = formationPlace.getPlayer();
        if (player === undefined) {
            return false;
        }
        const statistics = this.getStatistics(player, gameRound);
        if (statistics === undefined) {
            return false;
        }
        const formationLine = formationPlace.getFormationLine();
        return !formationPlace.isSubstitute() || formationLine.hasSubstituteAppareance(gameRound);
    }

    hasAppeared(formationPlace: S11FormationPlace, gameRound?: GameRound | undefined): boolean {
        const formationLine = formationPlace.getFormationLine();
        if (formationPlace.isSubstitute() && !formationLine.hasSubstituteAppareance(gameRound)) {
            return false;
        }
        const s11Player = formationPlace.getPlayer();
        if (s11Player === undefined) {
            return false;
        }
        // if( s11Player.getPerson().getLastName() === 'Crooij') {
        //     console.log('Crooij('+s11Player.getPerson().getId()+')');
        // }
        if (gameRound === undefined) {
            return s11Player.hasAppeared();
        }
        // if( s11Player.getPerson().getLastName() === 'Crooij') {
        //     console.log('Crooij', gameRound, this.getStatistics(s11Player, gameRound), this.personMap);
        // }
        return this.getStatistics(s11Player,gameRound)?.hasAppeared() === true;
    }

    public getStartingPlacesState(formationLine: S11FormationLine, gameRound: GameRound): GameState {
        const finishedPlaces = formationLine.getStartingPlaces().filter((formationPlace: S11FormationPlace): boolean => {
            const s11Player = formationPlace.getPlayer();
            if( s11Player === undefined) {
                return false;
            }
            return this.getStatistics(s11Player, gameRound) !== undefined
        });

        if (finishedPlaces.length === formationLine.getStartingPlaces().length) {
            return GameState.Finished;
        }
        if (finishedPlaces.length > 0) {
            return GameState.InProgress;
        }
        return GameState.Created;
    }

    private playerHasStatistics(s11Player: S11Player, gameRound: GameRound | number): boolean {
        
        return this.getStatistics(s11Player,gameRound) !== undefined;
    }

    // public hasSomeStatistics(): boolean {
    //     return this.statistics !== undefined && this.statistics.size > 0;
    // }

    public getStatistics(s11Player: S11Player, gameRound: GameRound | number): Statistics | undefined {
        const gameRoundNr = gameRound instanceof GameRound ? gameRound.getNumber() : gameRound;        
        const gameRoundStatsMap = this.personMap.get(s11Player.getPerson().getId());
        if( gameRoundStatsMap === undefined ) {
            return undefined;
        }
        return gameRoundStatsMap.get(gameRoundNr);         
    }

    public addStatistics(gameRound: GameRound | number, personId: string|number, statistics: Statistics): void {
        const gameRoundNr = gameRound instanceof GameRound ? gameRound.getNumber() : gameRound;
        // console.log('addStats-' + gameRoundNr + '-' + personId);
        let gameRoundStatsMap = this.personMap.get(personId);
        if( gameRoundStatsMap === undefined) {
            gameRoundStatsMap = new StatisticsMap();
            this.personMap.set(personId, gameRoundStatsMap );
        }
        gameRoundStatsMap.set(gameRoundNr, statistics);
    }

}

export class StatisticsMap extends Map<number, Statistics> { }
