import { FootballLine, GameState, Identifiable } from 'ngx-sport';
import { S11Formation } from '../formation';
import { GameRound } from '../gameRound';
import { S11Player } from '../player';
import { PointsCalculator } from '../points/calculator';
import { ScorePoints } from '../score/points';
import { S11FormationPlace } from './place';

export class S11FormationLine extends Identifiable {
    private static readonly SUBSTITUTE_NUMBER = 0;

    protected places: S11FormationPlace[] = [];
    // protected substituteAppearances: Map<number, boolean> = {};

    constructor(
        protected formation: S11Formation,
        protected number: FootballLine,
        protected substituteAppearances: Map<number, boolean>) {
        super();
        formation.getLines().push(this);
    }

    public getFormation(): S11Formation {
        return this.formation;
    }

    public getNumber(): FootballLine {
        return this.number;
    }

    public getPlaces(): S11FormationPlace[] {
        return this.places;
    }

    public getStartingPlaces(): S11FormationPlace[] {
        return this.places.filter((formationPlace: S11FormationPlace): boolean => {
            return formationPlace.getNumber() !== S11FormationLine.SUBSTITUTE_NUMBER;
        });
    }

    public getStartingPlacesState(gameRound: GameRound): GameState {
        const finishedPlaces = this.getStartingPlaces().filter((formationPlace: S11FormationPlace): boolean => {
            return formationPlace.getPlayer()?.getGameStatistics(gameRound.getNumber()) !== undefined;
        });

        if (finishedPlaces.length === this.getStartingPlaces().length) {
            return GameState.Finished;
        }
        if (finishedPlaces.length > 0) {
            return GameState.InProgress;
        }
        return GameState.Created;
    }

    // public canSubstituteAppear(gameRound: GameRound): GameState {
    //     const finishedPlaces = this.getStartingPlaces().filter((formationPlace: S11FormationPlace): boolean => {
    //         return formationPlace.getPlayer()?.getGameStatistics(gameRound.getNumber()) !== undefined;
    //     });

    //     if (finishedPlaces.length === this.getStartingPlaces().length) {
    //         return GameState.Finished;
    //     }
    //     if (finishedPlaces.length > 0) {
    //         return GameState.InProgress;
    //     }
    //     return GameState.Created;
    // }


    public getSubstitute(): S11FormationPlace {
        return this.getPlace(S11FormationLine.SUBSTITUTE_NUMBER);
    }

    public hasFreeSlot(): boolean {
        return this.places.some((formationPlace: S11FormationPlace): boolean => {
            return formationPlace.getPlayer() === undefined;
        });
    }

    public getPlace(number: number): S11FormationPlace {
        const place = this.places.find((formationPlace: S11FormationPlace): boolean => {
            return formationPlace.getNumber() === number;
        });
        if (place === undefined) {
            throw new Error('the formation-place for number "' + number + '" could not be found');
        }
        return place;
    }

    public hasSubstituteAppareance(gameRound: GameRound | undefined): boolean {
        if (gameRound === undefined) {
            return this.substituteAppearances.size > 0;
        }
        // console.log(this.getNumber(), this.substituteAppearances.has(gameRound.getNumber()));
        return this.substituteAppearances.has(gameRound.getNumber());
    }

    // public getSubstituteAppearances(): Map<number, boolean> {
    //     return this.substituteAppearances;
    // }
    // public setSubstituteAppearances(substituteAppearances: Map<number, boolean>) {
    //     this.substituteAppearances = substituteAppearances;
    // }

    public getPlayers(withSubstitute: boolean): S11Player[] {

        const places: S11FormationPlace[] = this.getStartingPlaces();
        if (withSubstitute) {
            places.push(this.getSubstitute());
        }
        const players: S11Player[] = [];
        places.forEach((place: S11FormationPlace) => {
            const player = place.getPlayer();
            if (player === undefined) {
                return;
            }
            players.push(player);
        });
        return players;
    }

    getPoints(gameRound: GameRound | undefined): number {
        let points = 0;
        for (let place of this.getPlaces()) {
            points += place.getPoints(gameRound);
        }
        return points;
    }
}