import { Sport, ScoreConfig, ScoreDirection } from 'ngx-sport';

export class TranslateService {
    static readonly language = 'nl';

    // getScoreNameSingular(sportScoreConfig: ScoreConfig): string {
    //     const customId = sportScoreConfig.getSport().getCustomId();
    //     if (!customId) {
    //         return '';
    //     }
    //     if (sportScoreConfig.isFirst()) {
    //         return this.getFirstScoreNameSingular(customId);
    //     } else if (sportScoreConfig.isLast()) {
    //         return this.getLastScoreNameSingular(customId);
    //     }
    //     return '';
    // }

    // protected getFirstScoreNameSingular(customId: number): string {
    //     switch (customId) {
    //         case CustomSport.Darts: { return 'leg'; }
    //         case CustomSport.Tennis: { return 'game'; }
    //         case CustomSport.Football:
    //         case CustomSport.Hockey: {
    //             return 'goal';
    //         }
    //     }
    //     return 'punt';
    // }

    // protected getLastScoreNameSingular(customId: number): string {
    //     switch (customId) {
    //         case CustomSport.Badminton:
    //         case CustomSport.Squash:
    //         case CustomSport.TableTennis:
    //         case CustomSport.Volleyball:
    //         case CustomSport.Darts:
    //         case CustomSport.Tennis: {
    //             return 'set';
    //         }
    //     }
    //     return '';
    // }

    // getScoreNamePlural(scoreConfig: ScoreConfig): string {
    //     const customId = scoreConfig.getSport().getCustomId();
    //     if (!customId) {
    //         return '';
    //     }
    //     if (scoreConfig.isFirst()) {
    //         return this.getFirstScoreNamePlural(customId);
    //     } else if (scoreConfig.isLast()) {
    //         return this.getLastScoreNamePlural(customId);
    //     }
    //     return '';
    // }

    // protected getFirstScoreNamePlural(customId: number): string {
    //     switch (customId) {
    //         case CustomSport.Darts: { return 'legs'; }
    //         case CustomSport.Tennis: { return 'games'; }
    //         case CustomSport.Football:
    //         case CustomSport.Hockey: {
    //             return 'goals';
    //         }
    //     }
    //     return 'punten';
    // }

    // protected getLastScoreNamePlural(customId: number): string {
    //     switch (customId) {
    //         case CustomSport.Badminton:
    //         case CustomSport.Squash:
    //         case CustomSport.TableTennis:
    //         case CustomSport.Volleyball:
    //         case CustomSport.Darts:
    //         case CustomSport.Tennis: {
    //             return 'sets';
    //         }
    //     }
    //     return '';
    // }


    // getScoreDirection(direction: number): string {
    //     switch (direction) {
    //         case ScoreDirection.Upwards: { return 'naar'; }
    //         case ScoreDirection.DownWards: { return 'vanaf'; }
    //     }
    //     return '';
    // }

    // getFieldNameSingular(sport?: Sport): string {
    //     const customId = sport ? sport.getCustomId() : undefined;
    //     switch (customId) {
    //         case CustomSport.Badminton: { return 'veld'; }
    //         case CustomSport.Basketball: { return 'veld'; }
    //         case CustomSport.Darts: { return 'bord'; }
    //         case CustomSport.ESports: { return 'veld'; }
    //         case CustomSport.Hockey: { return 'veld'; }
    //         case CustomSport.Baseball: { return 'veld'; }
    //         case CustomSport.Korfball: { return 'veld'; }
    //         case CustomSport.Chess: { return 'bord'; }
    //         case CustomSport.Squash: { return 'baan'; }
    //         case CustomSport.TableTennis: { return 'tafel'; }
    //         case CustomSport.Tennis: { return 'veld'; }
    //         case CustomSport.Football: { return 'veld'; }
    //         case CustomSport.Volleyball: { return 'veld'; }
    //         case CustomSport.IceHockey: { return 'veld'; }
    //     }
    //     return 'veld';
    // }

    // getFieldNamePlural(sport?: Sport): string {
    //     const customId = sport ? sport.getCustomId() : undefined;
    //     switch (customId) {
    //         case CustomSport.Badminton: { return 'velden'; }
    //         case CustomSport.Basketball: { return 'velden'; }
    //         case CustomSport.Darts: { return 'borden'; }
    //         case CustomSport.ESports: { return 'velden'; }
    //         case CustomSport.Hockey: { return 'velden'; }
    //         case CustomSport.Baseball: { return 'velden'; }
    //         case CustomSport.Korfball: { return 'velden'; }
    //         case CustomSport.Chess: { return 'borden'; }
    //         case CustomSport.Squash: { return 'banen'; }
    //         case CustomSport.TableTennis: { return 'tafels'; }
    //         case CustomSport.Tennis: { return 'velden'; }
    //         case CustomSport.Football: { return 'velden'; }
    //         case CustomSport.Volleyball: { return 'velden'; }
    //         case CustomSport.IceHockey: { return 'velden'; }
    //     }
    //     return 'velden';
    // }
}
