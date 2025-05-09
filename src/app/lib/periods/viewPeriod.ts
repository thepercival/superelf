import { Period } from 'ngx-sport';

export class ViewPeriod extends Period {
    protected id: number = 0;
    constructor(startDateTime: Date, endDateTime: Date) {
        super(startDateTime, endDateTime);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    // getGameRounds(): GameRound[] {
    //     return this.gameRounds;
    // }

    // hasGameRound(number: number): boolean {
    //     return this.gameRounds.find(gameRound => gameRound.getNumber() === number) !== undefined;
    // }

    // getGameRound(number: number): GameRound {
    //     const gameRound = this.gameRounds.find(gameRound => gameRound.getNumber() === number);
    //     if (gameRound === undefined) {
    //         throw new Error('gameRound could not be found for number "' + number + '"');
    //     }
    //     return gameRound;
    // }

    // mapGameRoundNumbers(gameRoundNumbers: number[]): GameRound[] {
    //     return gameRoundNumbers.map((gameRoundNumber: number): GameRound => {
    //         return this.getGameRound(gameRoundNumber);
    //     });
    // }
}