import { Competition, CompetitionSport, Identifiable, PlaceRange, Season } from 'ngx-sport';

import { PoolCollection } from './pool/collection';
import { AssemblePeriod } from './periods/assemblePeriod';
import { TransferPeriod } from './periods/transferPeriod';
import { ViewPeriod } from './periods/viewPeriod';
import { PoolUser } from './pool/user';
import { CompetitionConfig } from './competitionConfig';
import { PoolCompetitor } from './pool/competitor';
import { LeagueName } from './leagueName';

export class Pool extends Identifiable {
  protected competitions: Competition[] = [];

  static readonly PlaceRanges: PlaceRange[] = [
    { min: 1, max: 1, placesPerPoule: { min: 2, max: 40 } },
  ];

  constructor(
    protected collection: PoolCollection,
    protected competitionConfig: CompetitionConfig
  ) {
    super();
  }

  public getCollection(): PoolCollection {
    return this.collection;
  }

  public getCompetitionConfig(): CompetitionConfig {
    return this.competitionConfig;
  }

  public getSourceCompetition(): Competition {
    return this.competitionConfig.getSourceCompetition();
  }

  public getSeason(): Season {
    return this.competitionConfig.getSourceCompetition().getSeason();
  }

  // setRoles(roles: Role[]): void {
  //     this.roles = roles;
  // }

  public getName(): string {
    return this.getCollection().getName();
  }

  public getCompetitions(): Competition[] {
    return this.competitions;
  }

  public getCompetition(leagueName?: LeagueName): Competition | undefined {
    // const leagueName = this.getCollection().getLeagueName(leagueNr);
    return this.getCompetitions().find(
      (competition) => competition.getLeague().getName() === leagueName
    );
  }

  // public getAssociation(): Association | undefined {
  //     return this.getCompetition()?.getLeague().getAssociation();
  // }

  // public getPoints(): Points {
  //     return this.getCompetitionConfig().getPoints();
  // }

  public getAssemblePeriod(): AssemblePeriod {
    return this.getCompetitionConfig().getAssemblePeriod();
  }

  public getAssembleViewPeriod(): ViewPeriod {
    return this.getCompetitionConfig().getAssemblePeriod().getViewPeriod();
  }

  public getTransferPeriod(): TransferPeriod {
    return this.getCompetitionConfig().getTransferPeriod();
  }

  public getTransferViewPeriod(): ViewPeriod {
    return this.getCompetitionConfig().getTransferPeriod().getViewPeriod();
  }

  public getCurrentViewPeriod(date?: Date): ViewPeriod {
    if (date === undefined) {
      date = new Date();
    }
    if (date.getTime() > this.getTransferPeriod().getEndDateTime().getTime()) {
      return this.getTransferPeriod().getViewPeriod();
    }
    if (date.getTime() > this.getAssemblePeriod().getEndDateTime().getTime()) {
      return this.getAssemblePeriod().getViewPeriod();
    }
    return this.getCreateAndJoinPeriod();
  }

  // getScores(formationLineDef?: number): PoolScore[] {
  //     if (formationLineDef === undefined) {
  //         return this.scores;
  //     }
  //     return this.scores.filter(score => score.getBase().getLineDef() === formationLineDef);
  // }

  // getCompetitors(competition?: Competition): PoolCompetitor[] {
  //     if (competition === undefined) {
  //         return this.competitors;
  //     }
  //     return this.competitors.filter(competitor => competitor.getCompetition() === competition);
  // }

  // getCompetitorNames(competition?: Competition): string[] {
  //     return this.getCompetitors(competition).map(competitor => competitor.getName());
  // }

  public getStartDateTime(): Date {
    return this.getAssemblePeriod().getViewPeriod().getStartDateTime();
  }

  public getCreateAndJoinPeriod(): ViewPeriod {
    return this.getCompetitionConfig().getCreateAndJoinPeriod();
  }

  public isInCreateAndJoinPeriod(): boolean {
    return this.getCreateAndJoinPeriod().isIn();
  }

  public isInEditPeriod(): boolean {
    return (
      this.getCreateAndJoinPeriod().isIn() ||
      this.getAssemblePeriod().isIn() ||
      this.getTransferPeriod().isIn()
    );
  }

  public isInAssembleOrTransferPeriod(): boolean {
    return this.getAssemblePeriod().isIn() || this.getTransferPeriod().isIn();
  }

  public assemblePeriodNotStarted(date?: Date): boolean {
    const checkDate = date ? date : new Date();
    return checkDate < this.getAssemblePeriod().getStartDateTime();
  }

  public transferPeriodNotStarted(date?: Date): boolean {
    const checkDate = date ? date : new Date();
    return checkDate < this.getTransferPeriod().getStartDateTime();
  }

  // public getViewPeriodByRoundNumber(gameRoundNumber: number): ViewPeriod {
  //     if( this.getAssembleViewPeriod().hasGameRound(gameRoundNumber) ) {
  //       return this.getAssembleViewPeriod();
  //     }
  //     if( this.getTransferViewPeriod().hasGameRound(gameRoundNumber) ) {
  //       return this.getTransferViewPeriod();
  //     }
  //     throw new Error('gameroundnumber should be in a viewperiod');
  //   }

  public getCompetitionSport(leagueName: LeagueName): CompetitionSport {
    const competition = this.getCompetition(leagueName);
    if (competition === undefined) {
      throw Error("competitionSport not found");
    }
    const competitionSport = competition.getSingleSport();
    if (competitionSport === undefined) {
      throw Error("competitionSport not found");
    }
    return competitionSport;
  }

  public static getCompetitors(poolUsers: PoolUser[], leagueName: LeagueName): PoolCompetitor[] {
    const poolCompetitors: PoolCompetitor[] = [];
    poolUsers.forEach((poolUser: PoolUser) => {
      poolUser.getCompetitors().forEach((poolCompetitor: PoolCompetitor) => {
        if (
          poolCompetitor.getCompetition().getLeague().getName() === leagueName
        ) {
          poolCompetitors.push(poolCompetitor);
        }
      });
    });
    return poolCompetitors;
  }
}
