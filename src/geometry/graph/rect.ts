/*
 * @Author: theajack
 * @Date: 2021-08-12 23:20:08
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-07 01:17:15
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/graph/rect.ts
 */

import {IRect, IPoint, IStartEnd} from '../../types/graph';
import {Graph} from './graph';

export class Rect extends Graph implements IRect {
    
    start: IPoint;
    end: IPoint;
    
    constructor (rect: IStartEnd) {
        super();
        this.start = rect.start;
        this.end = rect.end;
    }

    isContainPoint (point: IPoint, isIncludeBoundary: boolean = true) {
        return isIncludeBoundary
            ? (
                this.start.x <= point.x &&
                this.start.y <= point.y &&
                this.end.x >= point.x &&
                this.end.y >= point.y
            )
            : (
                this.start.x < point.x &&
                this.start.y < point.y &&
                this.end.x > point.x &&
                this.end.y > point.y
            );
    }
}