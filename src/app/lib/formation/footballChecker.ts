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
}