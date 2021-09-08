/*
 * @Author: theajack
 * @Date: 2021-08-12 23:20:08
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-09 00:05:17
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\graph\rect.ts
 */

import {ISize} from 'src/types/type';
import {IRect, IPoint, IStartEnd} from '../../types/graph';
import {Graph} from './graph';

export class Rect extends Graph implements IRect {
    
    start: IPoint;
    end: IPoint;
    size: ISize;
    
    constructor (rect: IStartEnd) {
        super();
        this.start = rect.start;
        this.end = rect.end;
        this.size = {width: 0, height: 0};
        this.reinitSize();
    }

    reinitSize () {
        this.size.width = this.end.x - this.start.x + 1;
        this.size.height = this.end.y - this.start.y + 1;
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