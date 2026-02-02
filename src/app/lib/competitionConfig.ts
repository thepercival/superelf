import { AgainstGame, Competition, Identifiable, Season } from 'ngx-sport';
import { AssemblePeriod } from './periods/assemblePeriod';
import { TransferPeriod } from './periods/transferPeriod';
import { ViewPeriod } from './periods/viewPeriod';
import { FootballLineScore, FootballResult, FootballScore } from './score';
import { LineScorePoints, ScorePoints, ScorePointsMap } from './score/points';

export class CompetitionConfig extends Identifiable {
  protected scorePointsMap: ScorePointsMap;
  public static readonly MinRankToToQualifyForWorldCup = 2;

  constructor(
    protected sourceCompetition: Competition,
    protected scorePoints: ScorePoints[],
    protected lineScorePoints: LineScorePoints[],
    protected createAndJoinPeriod: ViewPeriod,
    protected assamblePeriod: AssemblePeriod,
    protected transferPeriod: TransferPeriod
  ) {
    super();
    this.scorePointsMap = new ScorePointsMap(
      this.scorePoints,
      this.lineScorePoints
    );
  }

  public getSeason(): Season {
    return this.getSourceCompetition().getSeason();
  }

  public getSourceCompetition(): Competition {
    return this.sourceCompetition;
  }

  public getAllScorePoints(): ScorePoints[] {
    return this.scorePoints;
  }

  public getScorePoints(score: FootballResult): number {
    const retVal = this.scorePointsMap.get(score);
    if (retVal === undefined) {
      throw new Error("scoreNotFound");
    }
    return retVal;
  }

  public getAllPointsForLines(): LineScorePoints[] {
    return this.lineScorePoints;
  }

  public getScorePointsMap(): ScorePointsMap {
    return this.scorePointsMap;
  }

  public getCreateAndJoinPeriod(): ViewPeriod {
    return this.createAndJoinPeriod;
  }

  public getAssemblePeriod(): AssemblePeriod {
    return this.assamblePeriod;
  }

  public isInCreateOrJoinOrAssemblePeriod(): boolean {
    return (
      this.getCreateAndJoinPeriod().isIn() || this.getAssemblePeriod().isIn()
    );
  }

  afterAssemblePeriod(date?: Date): boolean {
    if (date === undefined) {
      date = new Date();
    }
    return this.getAssemblePeriod().getEndDateTime().getTime() < date.getTime();
  }

  afterTransferPeriod(date?: Date): boolean {
    if (date === undefined) {
      date = new Date();
    }
    return this.getTransferPeriod().getEndDateTime().getTime() < date.getTime();
  }

  public getTransferPeriod(): TransferPeriod {
    return this.transferPeriod;
  }

  public isInAssembleOrTransferPeriod(): boolean {
    return this.getAssemblePeriod().isIn() || this.getTransferPeriod().isIn();
  }

  public getViewPeriods(): ViewPeriod[] {
    return [
      this.getCreateAndJoinPeriod(),
      this.getAssemblePeriod().getViewPeriod(),
      this.getTransferPeriod().getViewPeriod(),
    ];
  }

  // public getGameRounds(): GameRound[] {
  //   let gameRounds: GameRound[] = [];
  //   this.getViewPeriods().forEach((viewPeriod: ViewPeriod) => {
  //     gameRounds = gameRounds.concat(viewPeriod.getGameRounds());
  //   });
  //   return gameRounds;
  // }

  // public getViewPeriodByDate(dateTime: Date): ViewPeriod | undefined {
  //     return this.getViewPeriods().find((viewPeriod: ViewPeriod): boolean => {
  //         return viewPeriod.isIn(dateTime);
  //     });
  // }

  // public findGameRound(againstGame: AgainstGame): GameRound {
  //   const gameRound: GameRound | undefined = this.getGameRounds().find(
  //     (gameRoundIt: GameRound): boolean => {
  //       if (gameRoundIt.getNumber() !== againstGame.getGameRoundNumber()) {
  //         return false;
  //       }
  //       return (
  //         gameRoundIt
  //           .getAgainstGames()
  //           .find((againstGameIt) => againstGameIt === againstGame) !==
  //         undefined
  //       );
  //     }
  //   );
  //   if (gameRound == undefined) {
  //     throw new Error(
  //       "gameRound not found in competitionConfig " +
  //         this.getSourceCompetition().getName()
  //     );
  //   }
  //   return gameRound;
  // }
}

