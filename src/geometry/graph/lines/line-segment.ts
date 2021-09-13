/*
 * @Author: tackchen
 * @Date: 2021-09-11 16:14:03
 * @LastEditors: tackchen
 * @LastEditTime: 2021-09-12 17:06:51
 * @FilePath: /tc-image/src/geometry/graph/lines/line-segment.ts
 * @Description: 线段
 */

import {Graph} from '../base/graph';
import {ILineSegment, IPoint, IStartEnd} from '../../../types/graph';
import {Vector} from '../vector';
import {Point} from '../points/point';
import {isSameSign} from '../../../utils/math';
import {Rect} from '../closed-graphs/rect';

export class LineSegment extends Graph implements ILineSegment {
    
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
    
    /**
     * 是否与另一条线段相交
     * includeStartPoint: 表示是否包含目标线段line的起点在当前线段上(包含当前线段的两个端点上)
     * includeEndPoint: 表示是否包含目标线段line的终点在当前线段上(包含当前线段的两个端点上)
     */
    isIntersectAnotherLine (
        lineSeg: LineSegment,
        option: {
            includeStartPoint?: boolean;
            includeEndPoint?: boolean;
        } = {}
        // includeEndPoint: boolean = false, // 是否包含与端点相交
    ): {
        isTrue: boolean;
        isStartOnLine: boolean;
        isEndOnLine: boolean;
    } {
        const result = this.isSplit2Point(lineSeg.start, lineSeg.end, {
            includeP1OnLine: option.includeStartPoint,
            includeP2OnLine: option.includeEndPoint
        });

        const isTrue = (
            result.isTrue &&
            lineSeg.isSplit2Point(this.start, this.end, {includeP1OnLine: true, includeP2OnLine: true}).isTrue
        );
        return {
            isTrue,
            isStartOnLine: result.isP1OnLine,
            isEndOnLine: result.isP2OnLine,
        };
    }
    /**
     * 两个点是否在线段的两侧
     * includeP1InLine: 表示是否包含p1在线段上
     * includeEndPoint: 表示是否包含p2在线段上
     */
    isSplit2Point (
        p1: IPoint,
        p2: IPoint,
        // includeInLine: boolean = false
        option: {
            includeP1OnLine?: boolean;
            includeP2OnLine?: boolean;
        } = {}
    ): {
        isTrue: boolean;
        isP1OnLine: boolean;
        isP2OnLine: boolean;
    } {
        // https://www.cnblogs.com/tuyang1129/p/9390376.html
        const v1 = new Vector({start: this.start, end: p1});
        const r1 = this.vector.crossProduct(v1);
        const isP1OnLine = r1 === 0;
        let isTrue: boolean = true;
        if (!option.includeP1OnLine && isP1OnLine) isTrue = false;

        const v2 = new Vector({start: this.start, end: p2});
        const r2 = this.vector.crossProduct(v2);
        const isP2OnLine = r2 === 0;
        if (isTrue && !option.includeP2OnLine && isP2OnLine) isTrue = false;
        
        if (isTrue) isTrue = !isSameSign(r1, r2, false);

        return {isTrue, isP1OnLine, isP2OnLine};
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

    // 是否平行于另一条线段
    isParallelAnotherLine (lineSeg: LineSegment) {
        return this.isVerticalLine ?
            lineSeg.isVerticalLine :
            this.slope === lineSeg.slope;
    }

    // 是否重合于另一条线段
    isCoincideAnotherLine (lineSeg: LineSegment) {
        return this.isParallelAnotherLine(lineSeg) && (
            this.isVerticalLine ?
                this.verticalX === lineSeg.verticalX :
                this.intercept === lineSeg.intercept
        );
    }

    // 是否等于另一条线段
    isEqualAnotherLine (line: ILineSegment) {
        return this.start.isEqualAnotherPoint(line.start) &&
            this.end.isEqualAnotherPoint(line.end);
    }
}