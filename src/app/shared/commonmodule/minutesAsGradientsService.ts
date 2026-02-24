import { Statistics } from "../../lib/statistics";

export class MinutesAsGradientsService {
  // /**
  //  * green 0%,
  //  * green 50%,
  //  * red 50%,
  //  * red 100%
  //  * 
  //  * @param statistics 
  //  * @returns 
  //  */
  // public getAppearanceColumnsAsGradient(statistics: Statistics): string {
  //   const x = this.getAppearanceColumns(statistics)
  //     .map( (appearanceColumn: AppearanceColumn): string => {
  //       return appearanceColumn.color + ' ' + appearanceColumn.percentage + '%';
  //     })
  //     .join(',');
  //     if( x.length === 0 ) {
  //       console.log(statistics);
  //     }
  //   return this.getAppearanceColumns(statistics)
  //     .map( (appearanceColumn: AppearanceColumn): string => {
  //       return appearanceColumn.color + ' ' + appearanceColumn.percentage + '%';
  //     })
  //     .join(',');
  // }

  public getAppearanceColumns(statistics: Statistics, asDeltas: boolean = true): AppearanceColumn[] {
    const columns: AppearanceColumn[] = this.getAppearanceColumnsCummulative(statistics);
    if( !asDeltas ) {
      return columns;
    }
    const columnsDelta: AppearanceColumn[] = [];
    let previousColumn: AppearanceColumn|undefined;
    columns.forEach(column => {
      columnsDelta.push({
        playing: column.playing,
        percentage: column.percentage - (previousColumn?.percentage ?? 0)
      });
      previousColumn = column;
    });
    return columnsDelta;
  }

  private getAppearanceColumnsCummulative(statistics: Statistics): AppearanceColumn[] {
    if ( statistics.isSubstitute() && statistics.isSubstituted() ) {
      return  [
        { playing: false, percentage: this.convertMinutesToPercentage(statistics.getBeginMinute())},
        { playing: true, percentage: this.convertMinutesToPercentage(statistics.getEndMinute())},
        { playing: false, percentage: 100},
      ];
    } else if ( statistics.isSubstitute() ) {
      return [
        { playing: false, percentage: this.convertMinutesToPercentage(statistics.getBeginMinute())},
        { playing: true, percentage: 100}
      ];
    } else if ( statistics.isSubstituted() ) {
      return [
        { playing: true, percentage: this.convertMinutesToPercentage(statistics.getEndMinute())},
        { playing: false, percentage: 100}
      ];
    }
    return [
        { playing: true, percentage: 100}
    ];
  }

  /**
   * 
   * @param minutes 
   */
  private convertMinutesToPercentage(minutes: number): number {
    const percentage = Math.round( minutes / 90 * 100 );
    if( percentage <= 10 ) {
      return 10;
    } else if( percentage >= 90 ) {
      return 90;
    }
    return percentage + (10 - (percentage % 10));
  } 
}

export interface AppearanceColumn { 
  playing: boolean
  percentage: number
}