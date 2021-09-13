/*
 * @Author: theajack
 * @Date: 2021-08-12 23:20:23
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-12 14:07:58
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/graph/closed-graphs/circle.ts
 */

import {IPoint, ICircle} from '../../../types/graph';
import {ClosedGraph} from '../base/closed-graph';
import {Rect} from './rect';
import {Point} from '../points/point';
import {countCircleArea} from 'src/utils/math';

export class Circle extends ClosedGraph implements ICircle {
    center: Point;
    radius: number;

    boundary: Rect;
    
    constructor ({center, radius}: ICircle) {
        super();

        this.center = new Point(center);
        this.radius = radius;

        this.countBoundary();
    }
    
    protected countBoundary () {
        this.boundary = new Rect({
            start: {
                x: this.center.x - this.radius,
                y: this.center.y - this.radius,
            },
            end: {
                x: this.center.x + this.radius,
                y: this.center.y + this.radius,
            }
        });
        return this.boundary;
    }
    isContainPoint (point: IPoint, isIncludeBoundary: boolean = true) {
        if (!this.boundary.isContainPoint(point, isIncludeBoundary)) {
            return false;
        }
        const distance = this.center.countDistanceToAnotherPoint(point);
        return isIncludeBoundary ? (distance <= this.radius) : (distance < this.radius);
    }
    countArea () {
        return countCircleArea(this.radius);
    }
}