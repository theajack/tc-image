/*
 * @Author: theajack
 * @Date: 2021-08-12 23:19:54
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-07 01:10:01
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/graph/line.ts
 *
 * 线段
 */
import {Graph} from './graph';
import {ILine, IPoint, IStartEnd} from '../../types/graph';
import {Vector} from './vector';
import {Point} from './point';
import {isSameSign} from '../../utils/math';
import {Rect} from './rect';

export class Line extends Graph implements ILine {
    
    start: Point;
    end: Point;

    slope: number; // 斜率
    intercept: number; // 与y轴的截距
    
    isVerticalLine: boolean = false;
    verticalX: number;

    vector: Vector;

    rect: Rect;
    
    constructor ({start, end}: IStartEnd) {
        super();
        this.start = new Point(start);
        this.end = new Point(end);
        const xDiff = start.x - end.x;
        if (xDiff === 0) {
            this.isVerticalLine = true;
            this.verticalX = start.x;
        } else {
            this.slope = (start.y - end.y) / xDiff;
            this.intercept = (end.y * start.x - start.y * end.x) / xDiff;
        }
        this.vector = new Vector({start, end});

        this.rect = new Rect({
            start: {
                x: Math.min(start.x, end.x),
                y: Math.min(start.y, end.y)
            },
            end: {
                x: Math.max(start.x, end.x),
                y: Math.max(start.y, end.y)
            }
        });
    }
    
    // 是否与另一条线段相交
    isIntersectAnthorLine (
        line: Line,
        includeEndPoint: boolean = false, // 是否包含与端点相交
    ): boolean {
        return (
            this.isSplit2Point(line.start, line.end, includeEndPoint) &&
            line.isSplit2Point(this.start, this.end, includeEndPoint)
        );
    }
    // 两个点是否在线段的两侧
    isSplit2Point (
        p1: IPoint,
        p2: IPoint,
        includeInLine: boolean = false // 是否包含点在线上的情况
    ): boolean {
        // https://www.cnblogs.com/tuyang1129/p/9390376.html
        const v1 = new Vector({start: this.start, end: p1});
        const v2 = new Vector({start: this.start, end: p2});

        const r1 = this.vector.crossProduct(v1);
        const r2 = this.vector.crossProduct(v2);
        return !isSameSign(r1, r2, !includeInLine);
    }

    // needOnLine = true表示必须在线段上
    isContainPoint (point: IPoint, needOnLine: boolean = true): boolean {
        if (needOnLine && !this.rect.isContainPoint(point)) {
            return false;
        }
        if (this.isVerticalLine) {
            return point.x === this.verticalX;
        }
        return point.y === this.slope * point.x + this.intercept;
    }
}

window.Line = Line;