/*
 * @Author: theajack
 * @Date: 2021-08-12 23:20:02
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-11 16:41:46
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/graph/points/point.ts
 */

import {IPoint} from '../../../types/graph';
import {Graph} from '../base/graph';
import {sqrtSquareSum} from '../../../utils/math';

export class Point extends Graph implements IPoint {
    
    x: number;
    y: number;
    
    constructor (point: IPoint) {
        super();
        this.x = point.x;
        this.y = point.y;
    }

    isEqualAnotherPoint (point: IPoint) {
        return this.x === point.x && this.y === point.y;
    }

    isContainPoint (point: IPoint) {
        return this.isEqualAnotherPoint(point);
    }
    
    countDistanceToAnotherPoint (point: IPoint) {
        return sqrtSquareSum(this.x - point.x, this.y - point.y);
    }
}