import { FootballLine, Formation, FormationLine, Team } from "ngx-sport";
import { S11Formation } from "../formation";
import { OneTeamSimultaneous } from "../oneTeamSimultaneousService";
import { PoolUser } from "../pool/user";
import { S11FormationPlace } from "./place";

export class FootballFormationChecker {
    
    constructor(protected availableFormations: Formation[]) {
        
    }

    addableLines(formation: Formation, lineToRemove: FootballLine): FootballLine[] {
        const formationWithRemovedPerson = this.removePersonFromLine(formation, lineToRemove);
        
        const addableLines = [];
        for (const [propertyKey, lineToAdd] of Object.entries(FootballLine)) {
            if ((typeof lineToAdd === 'string')) {
              continue;
            }
            if( this.isAvailable(this.addPersonFromLine(formationWithRemovedPerson, lineToAdd)) ) {
                addableLines.push(lineToAdd);
            }
        }
        return addableLines;
    }

    private removePersonFromLine(formation: Formation, footballLine: FootballLine): Formation {
        const formationLines = formation.getLines().map( (lineIt: FormationLine): FormationLine => {
            if( lineIt.getNumber() !== footballLine ) {
                return lineIt;
            }
            return new FormationLine(lineIt.getNumber(), lineIt.getNrOfPersons() - 1 );
        });
        return new Formation(formationLines);
    }

    private addPersonFromLine(formation: Formation, footballLine: FootballLine): Formation {
        const formationLines = formation.getLines().map( (lineIt: FormationLine): FormationLine => {
            if( lineIt.getNumber() !== footballLine ) {
                return lineIt;
            }
            return new FormationLine(lineIt.getNumber(), lineIt.getNrOfPersons() + 1 );
        });
        return new Formation(formationLines);
    }

    public isAvailable(formation: Formation): boolean {
        return this.availableFormations.some((availableFormation: Formation): boolean => {
            return availableFormation.equals(formation);
        });
    }

    public allPlacesWithoutTeamReplaced(poolUser: PoolUser): boolean {
        return true;
    }

    private areAllPlacesWithoutTeamReplaced(poolUser: PoolUser): boolean {
        const replacements = poolUser.getReplacements().slice();

        const transferPeriodStart = poolUser.getPool().getTransferPeriod().getStartDateTime();

        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined ) {
            throw new Error('kies eerst een startformatie');
        }
        const placesWithoutTeam = this.getPlacesWithoutTeam(assembleFormation,transferPeriodStart);

        if( replacements.length > placesWithoutTeam.length ) {
            throw new Error('te veel vervangingen voor de formatieplekken');
        }
        return placesWithoutTeam.length === replacements.length;
    }

    private  getPlacesWithoutTeam(formation: S11Formation, dateTime: Date): S11FormationPlace[]
    {
        return formation.getPlaces().filter( (place: S11FormationPlace): boolean => {
                return this.getTeam(place, dateTime ) === undefined;
            }
        );
    }

    private getTeam(place: S11FormationPlace, dateTime: Date): Team|undefined
    {
        const oneTeamSim = new OneTeamSimultaneous();
        const s11Player = place.getPlayer();
        if( s11Player === undefined ) {
            return undefined;
        }
        const player = oneTeamSim.getPlayer(s11Player, dateTime );
        return player?.getTeam();
    }
}