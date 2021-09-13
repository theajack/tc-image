/*
 * @Author: tackchen
 * @Date: 2021-09-11 16:01:40
 * @LastEditors: tackchen
 * @LastEditTime: 2021-09-12 16:46:40
 * @FilePath: /tc-image/src/geometry/graph/closed-graphs/sector.ts
 * @Description: Coding something
 */


import {IPoint, ISector} from '../../../types/graph';
import {ClosedGraph} from '../base/closed-graph';
import {Rect} from './rect';
import {Point} from '../points/point';
import {parseDeg, countCircleArea} from '../../../utils/math';

export class Sector extends ClosedGraph implements ISector {
    
    center: Point;
    radius: number;

    startDeg: number;
    endDeg: number;

    boundary: Rect;
    
    constructor ({
        center, radius, startDeg, endDeg
    }: ISector) {
        super();
        this.startDeg = parseDeg(startDeg);
        this.endDeg = parseDeg(endDeg);
        this.center = new Point(center);
        this.radius = radius;
        this.boundary = this.countBoundary();
    }
    protected countBoundary () {
        // todo 重写
        return new Rect({
            start: {
                x: this.center.x - this.radius,
                y: this.center.y - this.radius,
            },
            end: {
                x: this.center.x + this.radius,
                y: this.center.y + this.radius,
            }
        });
    }
    isContainPoint (point: IPoint, isIncludeBoundary: boolean = true) {
        // todo 重写
        if (!this.boundary.isContainPoint(point, isIncludeBoundary)) {
            return false;
        }
        const distance = this.center.countDistanceToAnotherPoint(point);
        return isIncludeBoundary ? (distance <= this.radius) : (distance < this.radius);
    }
    countArea () {
        return countCircleArea(this.radius) * (Math.abs(this.endDeg - this.startDeg) / 360);
    }

    countGrith () {
        return 0;
    }
}