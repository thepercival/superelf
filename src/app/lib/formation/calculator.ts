import { FootballLine, Player } from "ngx-sport";
import { Replacement } from "../editAction/replacement";
import { Substitution } from "../editAction/substitution";
import { Transfer } from "../editAction/transfer";
import { S11Formation } from "../formation";
import { S11Player } from "../player";
import { PoolUser } from "../pool/user";
import { JsonTotals } from "../totals/json";
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
        this.toConsole('after assemble', newFormation);        
        poolUser.getReplacements().forEach((replacement: Replacement) => {
            newFormation = this.processReplacement(newFormation, replacement);            
        });
        this.toConsole('after replace', newFormation);        
        
        poolUser.getTransfers().forEach((transfer: Transfer) => {
            newFormation = this.processTransfer(newFormation, transfer);            
        });
        this.toConsole('after transfer', newFormation);        
        
        poolUser.getSubstitutions().forEach((substitution: Substitution) => {
            newFormation = this.processSubstitution(newFormation, substitution);            
        });
        this.toConsole('after substitute', newFormation);        
        return newFormation;
    }    

    private processReplacement(currentFormation: S11Formation, replacement: Replacement): S11Formation {
        
        const viewPeriod = currentFormation.getPoolUser().getPool().getCompetitionConfig().getTransferPeriod().getViewPeriod();
        if( replacement.getLineNumberOut() === replacement.getPlayerIn().getLine() ) {
            return this.updatePlace(currentFormation, replacement);
        }
        console.log('start processReplacement');
        // remove place
        currentFormation = this.removePlace(currentFormation, replacement.getLineNumberOut(), replacement.getPlaceNumberOut() );
        
        // add Player To End of line
        currentFormation = this.addPlace(currentFormation, replacement.getPlayerIn(), false );        
        return currentFormation;
    }

    private processTransfer(currentFormation: S11Formation, transfer: Transfer): S11Formation {
        
        const viewPeriod = currentFormation.getPoolUser().getPool().getCompetitionConfig().getTransferPeriod().getViewPeriod();
        if( transfer.getLineNumberOut() === transfer.getPlayerIn().getLine() ) {
            return this.updatePlace(currentFormation, transfer);
        }
        console.log('start processTransfer');
        // remove place
        currentFormation = this.removePlace(currentFormation, transfer.getLineNumberOut(), transfer.getPlaceNumberOut() );
        
        // add Player To End of line        
        return this.addPlace(currentFormation, transfer.getPlayerIn(), false );
    }

    private processSubstitution(currentFormation: S11Formation, substitution: Substitution): S11Formation {
        
        console.log('start processSubstitution');
        const place = currentFormation.getPlace(substitution.getLineNumberOut(), substitution.getPlaceNumberOut());
        const substitutePlace = currentFormation.getPlace(substitution.getLineNumberOut(), 0);
        // remove
        currentFormation = this.removePlace(currentFormation, substitution.getLineNumberOut(), place.getNumber() );
        // remove substitute
        currentFormation = this.removePlace(currentFormation, substitution.getLineNumberOut(), substitutePlace.getNumber() );

        const player = this.getPlayerDescendingStart(place.getPlayer());
        const playerSubstitute = this.getPlayerDescendingStart(substitutePlace.getPlayer());
        if( player === undefined || playerSubstitute === undefined) {
            throw new Error('all places should have players');
        }
        currentFormation = this.addPlace(currentFormation, playerSubstitute, false ); // add place        
        return this.addPlace(currentFormation, player, true ); // add substitution
    }

    getPlayerDescendingStart(s11Player: S11Player|undefined): Player|undefined {
        if( s11Player === undefined) {
          return undefined;
        }
        return s11Player.getPlayersDescendingStart().shift();
    }

    private updatePlace(currentFormation: S11Formation, editAction: Replacement|Transfer): S11Formation {
        
        const newFormation = new S11Formation(currentFormation.getPoolUser(), currentFormation.getViewPeriod());
        currentFormation.getLines().forEach((currentLine: S11FormationLine) => {
            const line = new S11FormationLine(newFormation, currentLine.getNumber(), new Map());
            currentLine.getPlaces().forEach((currentPlace: S11FormationPlace) => {
                let currentS11Player = currentPlace.getPlayer();
                if( currentS11Player === undefined) {
                    throw new Error('place should have a player');
                }
                let newS11Player = currentS11Player;                
                if( editAction.getLineNumberOut() === line.getNumber()
                && editAction.getPlaceNumberOut() === currentPlace.getNumber()  ) {
                    const playerIn = editAction.getPlayerIn();
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

    private addPlace(currentFormation: S11Formation, player: Player, asSubstitute: boolean): S11Formation {
        const playerLineNumber = player.getLine();        
        const newFormation = new S11Formation(currentFormation.getPoolUser(), currentFormation.getViewPeriod());
        currentFormation.getLines().forEach((currentLine: S11FormationLine) => {
            const line = new S11FormationLine(newFormation, currentLine.getNumber(), new Map());
            currentLine.getPlaces().forEach((currentPlace: S11FormationPlace) => {
                new S11FormationPlace(
                    line, currentPlace.getPlayer(), currentPlace.getNumber(), 
                    currentPlace.getTotals(), currentPlace.getTotalPoints() 
                );                
            });
            if( line.getNumber() === playerLineNumber) {
                const newS11Player = new S11Player(
                    currentFormation.getViewPeriod(), player.getPerson(), [player], 
                    this.createTotals(), 0
                );
                const placeNumber = asSubstitute ? 0 : currentLine.getStartingPlaces().length + 1;
                // console.log('add Place to lineNr ' + line.getNumber() + ' as placeNr ' + placeNumber);
                new S11FormationPlace(
                    line, newS11Player, placeNumber, 
                    this.createTotals(), 0 
                );                
            }  
        });
        return newFormation;
    }

    private createTotals(): JsonTotals {
        return {
            nrOfWins: 0,
            nrOfDraws: 0,
            nrOfTimesStarted: 0,
            nrOfTimesSubstituted: 0,
            nrOfTimesSubstitute: 0,
            nrOfTimesNotAppeared: 0,
            nrOfFieldGoals: 0,
            nrOfAssists: 0,
            nrOfPenalties: 0,
            nrOfOwnGoals: 0,
            nrOfCleanSheets: 0,
            nrOfSpottySheets: 0,
            nrOfYellowCards: 0,
            nrOfRedCards: 0
        }

    }

    private removePlace(currentFormation: S11Formation, lineNumber: FootballLine, placeNumber: number): S11Formation {
        if( placeNumber === 0 ) {
            return this.removeSubstitutePlace(currentFormation, lineNumber);
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
                new S11FormationPlace(
                    line, currentPlace.getPlayer(), newPlaceNumber, 
                    currentPlace.getTotals(), currentPlace.getTotalPoints() 
                );                
            });    
        });
        return newFormation;
    }

    private removeSubstitutePlace(currentFormation: S11Formation, lineNumber: FootballLine): S11Formation {
        const newFormation = new S11Formation(currentFormation.getPoolUser(), currentFormation.getViewPeriod());
        currentFormation.getLines().forEach((currentLine: S11FormationLine) => {
            const line = new S11FormationLine(newFormation, currentLine.getNumber(), new Map());
            
            let places;
            if( line.getNumber() === lineNumber ) {
                places = currentLine.getStartingPlaces();
            } else {
                places = currentLine.getPlaces();
            }

            places.forEach((currentPlace: S11FormationPlace) => {
                let newPlaceNumber = currentPlace.getNumber();
                new S11FormationPlace(
                    line, currentPlace.getPlayer(), newPlaceNumber, 
                    currentPlace.getTotals(), currentPlace.getTotalPoints() 
                );                
            });    
            
        });
        return newFormation;
    }

    public areAllPlacesWithoutTeamReplaced(poolUser: PoolUser): boolean {        
        const replacements = poolUser.getReplacements().slice();

        const transferPeriodStart = poolUser.getPool().getTransferPeriod().getStartDateTime();

        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined ) {
            throw new Error('kies eerst een startformatie');
        }
        const placesWithoutTeam = assembleFormation.getPlacesWithoutTeam(transferPeriodStart);

        if( replacements.length > placesWithoutTeam.length ) {
            throw new Error('te veel vervangingen voor de formatieplekken');
        }
        return placesWithoutTeam.length === replacements.length;
    }

    private toConsole(header: string, currentFormation: S11Formation): void {
        const linesAsString = currentFormation.getLines().map((formationLine: S11FormationLine): string => {
            return '' + formationLine.getStartingPlaces().length;
        });
        console.log( header + ' : ' + linesAsString.join('-') );
    }
}