import { Injectable } from '@angular/core';
import { Points } from '../points';

import { JsonPoints } from './json';

@Injectable({
    providedIn: 'root'
})
export class PointsMapper {
    constructor() { }

    toObject(json: JsonPoints): Points {
        return new Points(
            json.resultWin,
            json.resultDraw,
            json.fieldGoalGoalkeeper,
            json.fieldGoalDefender,
            json.fieldGoalMidfielder,
            json.fieldGoalForward,
            json.assistGoalkeeper,
            json.assistDefender,
            json.assistMidfielder,
            json.assistForward,
            json.penalty,
            json.ownGoal,
            json.cleanSheetGoalkeeper,
            json.cleanSheetDefender,
            json.spottySheetGoalkeeper,
            json.spottySheetDefender,
            json.cardYellow,
            json.cardRed
        );
    }

    // toJson(points: Points): JsonPoints {
    //     return {
    //         id: collection.getId(),
    //         association: this.associationMapper.toJson(collection.getAssociation())
    //     };
    // }
}
