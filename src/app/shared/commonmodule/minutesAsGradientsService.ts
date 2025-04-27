import { Statistics } from "../../lib/statistics";

export class MinutesAsGradientsService {
  /**
   * green 0%,
   * green 50%,
   * red 50%,
   * red 100%
   * 
   * @param statistics 
   * @returns 
   */
  public getAppearanceColumnsAsGradient(statistics: Statistics): string {
    const x = this.getAppearanceColumns(statistics)
      .map( (appearanceColumn: AppearanceColumn): string => {
        return appearanceColumn.color + ' ' + appearanceColumn.percentage + '%';
      })
      .join(',');
      if( x.length === 0 ) {
        console.log(statistics);
      }
    return this.getAppearanceColumns(statistics)
      .map( (appearanceColumn: AppearanceColumn): string => {
        return appearanceColumn.color + ' ' + appearanceColumn.percentage + '%';
      })
      .join(',');
  }

  public getAppearanceColumns(statistics: Statistics): AppearanceColumn[] {
    const red = '#d9534f'; // danger
    const green = '#75b798'; // green-300, success
    if ( statistics.isSubstitute() && statistics.isSubstituted() ) {
      return  [
        { color: red, percentage: 0},
        { color: red, percentage: this.convertMinutesToPercentage(statistics.getBeginMinute())},
        { color: green, percentage: this.convertMinutesToPercentage(statistics.getBeginMinute())},
        { color: green, percentage: this.convertMinutesToPercentage(statistics.getEndMinute())},
        { color: red, percentage: this.convertMinutesToPercentage(statistics.getEndMinute())},
        { color: red, percentage: 100},
      ];
    } else if ( statistics.isSubstitute() ) {
      return [
        { color: red, percentage: 0},
        { color: red, percentage: this.convertMinutesToPercentage(statistics.getBeginMinute())},
        { color: green, percentage: this.convertMinutesToPercentage(statistics.getBeginMinute())},
        { color: green, percentage: 100}
      ];
    } else if ( statistics.isSubstituted() ) {
      return [
        { color: green, percentage: 0},
        { color: green, percentage: this.convertMinutesToPercentage(statistics.getEndMinute())},
        { color: red, percentage: this.convertMinutesToPercentage(statistics.getEndMinute())},
        { color: red, percentage: 100}
      ];
    }
    return [
        { color: green, percentage: 0},
        { color: green, percentage: 100}
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

interface AppearanceColumn { 
  color: string,
  percentage: number
}