// import { Injectable } from '@angular/core';

// @Injectable()
// export class ScoreMapper {
//     protected scores: Score[] = [];

//     constructor() { }

//     toObject(nr: number, disableCache?: boolean): Score {
//         let score;
//         if (disableCache !== true) {
//             score = this.scores[nr];
//         }
//         if (score === undefined) {
//             score = new Score(nr);
//             this.scores[nr] = score;
//         }
//         return new Score(nr);
//     }

//     toJson(score: Score): number {
//         return score.getNumber();
//     }
// }


