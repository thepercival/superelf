import { FootballLine, Player } from "ngx-sport";
import { Replacement } from "../editAction/replacement";
import { S11Formation } from "../formation";
import { S11Player } from "../player";
import { PoolUser } from "../pool/user";
import { S11FormationLine } from "./line";
import { S11FormationPlace } from "./place";

export class S11FormationCalculator {
    
    constructor() {
        
    }

    getCurrentFormation(poolUser: PoolUser): S11Formation|undefined {
        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined) {
            return undefined;
        }
        let newFormation = assembleFormation;        
        poolUser.getReplacements().forEach((replacement: Replacement) => {
            newFormation = this.processReplacement(newFormation, replacement);            
        });
        return newFormation;

        // const formationWithRemovedPerson = this.removePersonFromLine(formation, lineToRemove);
        
        // const addableLines = [];
        // for (const [propertyKey, lineToAdd] of Object.entries(FootballLine)) {
        //     if ((typeof lineToAdd === 'string')) {
        //       continue;
        //     }
        //     if( this.isAvailable(this.addPersonFromLine(formationWithRemovedPerson, lineToAdd)) ) {
        //         addableLines.push(lineToAdd);
        //     }
        // }
        // return addableLines;
    }    

    private processReplacement(currentFormation: S11Formation, replacement: Replacement): S11Formation {
        
        const viewPeriod = currentFormation.getPoolUser().getPool().getCompetitionConfig().getTransferPeriod().getViewPeriod();
        if( replacement.getLineNumberOut() === replacement.getPlayerIn().getLine() ) {
            return this.updatePlace(currentFormation, replacement);
        }
        
        // remove place
        currentFormation = this.removePlace(currentFormation, replacement.getLineNumberOut(), replacement.getPlaceNumberOut() );
        
        // add Player To End of line
        return this.addPlace(currentFormation, replacement.getPlayerIn() );
    }

    private updatePlace(currentFormation: S11Formation, replacement: Replacement): S11Formation {
        
        const newFormation = new S11Formation(currentFormation.getPoolUser(), currentFormation.getViewPeriod());
        currentFormation.getLines().forEach((currentLine: S11FormationLine) => {
            const line = new S11FormationLine(newFormation, currentLine.getNumber(), new Map());
            currentLine.getPlaces().forEach((currentPlace: S11FormationPlace) => {
                let currentS11Player = currentPlace.getPlayer();
                if( currentS11Player === undefined) {
                    throw new Error('place should have a player');
                }
                let newS11Player = currentS11Player;                
                if( replacement.getLineNumberOut() === line.getNumber()
                && replacement.getPlaceNumberOut() === currentPlace.getNumber()  ) {
                    const playerIn = replacement.getPlayerIn();
                    newS11Player = new S11Player(
                        currentFormation.getViewPeriod(), playerIn.getPerson(), [playerIn], currentPlace.getTotals(), 0
                    );
                }                
                new S11FormationPlace(
                    line, 
                    newS11Player, 
                    currentPlace.getNumber(), 
                    currentPlace.getTotals(), 
                    currentPlace.getTotalPoints() 
                );                
            });    
        });
        return newFormation;
    }

    private addPlace(currentFormation: S11Formation, player: Player): S11Formation {
        const lineNumber = player.getLine();        
        const newFormation = new S11Formation(currentFormation.getPoolUser(), currentFormation.getViewPeriod());
        currentFormation.getLines().forEach((currentLine: S11FormationLine) => {
            const line = new S11FormationLine(newFormation, currentLine.getNumber(), new Map());
            currentLine.getPlaces().forEach((currentPlace: S11FormationPlace) => {
                new S11FormationPlace(
                    line, currentPlace.getPlayer(), currentPlace.getNumber(), 
                    currentPlace.getTotals(), currentPlace.getTotalPoints() 
                );                
            });
            if( line.getNumber() === lineNumber) {
                const newS11Player = new S11Player(
                    currentFormation.getViewPeriod(), player.getPerson(), [player], 
                    currentLine.getSubstitute().getTotals(), currentLine.getSubstitute().getTotalPoints()
                );
                new S11FormationPlace(
                    line, newS11Player, currentLine.getStartingPlaces().length + 1, 
                    currentLine.getSubstitute().getTotals(), currentLine.getSubstitute().getTotalPoints() 
                );                
            }  
        });
        return newFormation;
    }

    private removePlace(currentFormation: S11Formation, lineNumber: FootballLine, placeNumber: number): S11Formation {
        if( placeNumber === 0 ) {
            return this.removeSubstitutePlace(currentFormation, lineNumber, placeNumber);
        }
        return this.removeStartingPlace(currentFormation, lineNumber, placeNumber);
    }

    private removeStartingPlace(currentFormation: S11Formation, lineNumber: FootballLine, placeNumber: number): S11Formation {
        const newFormation = new S11Formation(currentFormation.getPoolUser(), currentFormation.getViewPeriod());
        currentFormation.getLines().forEach((currentLine: S11FormationLine) => {
            const line = new S11FormationLine(newFormation, currentLine.getNumber(), new Map());
            let removed = false;
            currentLine.getPlaces().forEach((currentPlace: S11FormationPlace) => {
                if( line.getNumber() === lineNumber && currentPlace.getNumber() === placeNumber ) {
                    removed = true;
                    return;
                }
                let newPlaceNumber = currentPlace.getNumber();
                if( removed && currentPlace.getNumber() > 0 ) {
                    newPlaceNumber--;
                }
                console.log(line, newPlaceNumber);
                new S11FormationPlace(
                    line, currentPlace.getPlayer(), newPlaceNumber, 
                    currentPlace.getTotals(), currentPlace.getTotalPoints() 
                );                
            });    
        });
        return newFormation;
    }

    private removeSubstitutePlace(currentFormation: S11Formation, lineNumber: FootballLine, placeNumber: number): S11Formation {
        const newFormation = new S11Formation(currentFormation.getPoolUser(), currentFormation.getViewPeriod());
        currentFormation.getLines().forEach((currentLine: S11FormationLine) => {
            const line = new S11FormationLine(newFormation, currentLine.getNumber(), new Map());
            let removed = false;
            currentLine.getPlaces().forEach((currentPlace: S11FormationPlace) => {
                if( line.getNumber() === lineNumber && currentPlace.getNumber() === placeNumber ) {
                    removed = true;
                    return;
                }
                let newPlaceNumber = currentPlace.getNumber();
                if( currentPlace.getNumber() === currentLine.getStartingPlaces().length ) {
                    newPlaceNumber = 0;
                }
                console.log(line, newPlaceNumber);
                new S11FormationPlace(
                    line, currentPlace.getPlayer(), newPlaceNumber, 
                    currentPlace.getTotals(), currentPlace.getTotalPoints() 
                );                
            });    
        });
        return newFormation;
    }

    // findPlace(formation: Formation, person: Person): S11Formation|undefined {
    //     const assembleFormation = poolUser.getAssembleFormation();
    //     if( assembleFormation === undefined) {
    //         return undefined;
    //     }

    //     poolUser.getReplacements().forEach((replacement: Replacement) => {
    //         // haal het team op van 
    //         const oldS11Player = replacement.getFormationPlace().getPlayer();
    //         if( oldS11Player === undefined) {
    //             return;
    //         }
    //         const oldPlayer = oldS11Player.getPlayersDescendingStart().shift();
    //         if( oldPlayer === undefined) {
    //             return;
    //         }
    //         // haal new TeamIn op
    //         calculator.getPlace(assembleFormation, person
    //         const transferPeriodStart = poolUser.getPool().getCompetitionConfig().getTransferPeriod().getStartDateTime();
    //         replacement.getPersonIn().getPlayer( );
            
    //         (new OneTeamSimultaneous()).getPlayer(s11Player, date); //  
    //         const newFormationPlace = ;
    //         assembleFormation.getPlayer
    //     });
    //     return undefined;
    // }    
}