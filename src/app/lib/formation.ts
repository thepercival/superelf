
import { FootballLine, Formation, FormationLine, Identifiable, Person } from 'ngx-sport';
import { BadgeCategory } from './achievement/badge/category';
import { S11FormationLine } from './formation/line';
import { S11FormationPlace } from './formation/place';
import { GameRound } from './gameRound';
import { ViewPeriod } from './periods/viewPeriod';
import { S11Player } from './player';
import { PoolUser } from './pool/user';

export class S11Formation extends Identifiable {
    static readonly FootbalNrOfPersons: number = 11;
    private lines: S11FormationLine[] = [];

    constructor(protected poolUser: PoolUser, protected viewPeriod: ViewPeriod) {
        super();
    }

    public getPoolUser(): PoolUser {
        return this.poolUser;
    }

    public getLines(): S11FormationLine[] {
        return this.lines;
    }

    public getLine(lineNumber: number): S11FormationLine {
        const line = this.lines.find(line => line.getNumber() === lineNumber);
        if (line === undefined) {
            throw new Error('formationline not found');
        }
        return line;
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }

    public getPlace(lineNumber: FootballLine, placeNumber: number): S11FormationPlace {
        return this.getLine(lineNumber).getPlace(placeNumber);
    }

    public getPlaces(): S11FormationPlace[] {
        let places: S11FormationPlace[] = [];
        this.lines.forEach(line => {
            places = places.concat(line.getPlaces());
        });
        return places;
    }

    public getPlacesWithoutTeam(dateTime: Date): S11FormationPlace[]
    {
        return this.getPlaces().filter( (place: S11FormationPlace): boolean => {
                return place.getTeam(dateTime ) === undefined;
            }
        );
    }

    public getPlayers(): S11Player[] {
        let players: S11Player[] = [];
        this.lines.forEach(line => {
            players = players.concat(line.getPlayers(true));
        });
        return players;
    }

    // public getPlayer(team: Team, date?: Date): S11Player | undefined {
    //     const checkDate = date ? date : new Date();
    //     return this.getPlayers().find((s11Player: S11Player): boolean => {
    //         return s11Player.getPlayer(team, checkDate) !== undefined;
    //     });
    // }

    public getPersons(): Person[] {
        return this.getPlayers().map((player: S11Player) => player.getPerson());
    }

    public getName(): string {
        return this.getLines().map((line: S11FormationLine) => line.getPlaces().length - 1).join('-');
    }

    public getEqualFormation(formations: Formation[]): Formation | undefined {
        const formationBase = this.convertToBase();
        return formations.find((formation: Formation): boolean => {
            return formationBase.equals(formation);
        });
    }

    public convertToBase(): Formation {
        return new Formation( this.getLines().map((s11Line: S11FormationLine): FormationLine => {
            return new FormationLine(s11Line.getNumber(), s11Line.getStartingPlaces().length );
        } ) );
    }

    getTotalPoints(badgeCategory: BadgeCategory|undefined): number {
        let points = 0;
        for (let line of this.getLines()) {
            points += line.getTotalPoints(badgeCategory);
        }
        return points;
    }
}