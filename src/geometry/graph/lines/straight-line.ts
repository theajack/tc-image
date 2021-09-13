/*
 * @Author: theajack
 * @Date: 2021-08-12 23:19:54
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-13 09:06:44
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/graph/lines/straight-line.ts
 *
 * 直线
 */


import {Graph} from '../base/graph';
import {IStraightLine, IPoint, IStartEnd} from '../../../types/graph';
import {Vector} from '../vector';
import {Point} from '../points/point';
import {isSameSign} from '../../../utils/math';
import {Rect} from '../closed-graphs/rect';

export class StraightLine extends Graph implements IStraightLine {
    slope: number; // 斜率
    intercept: number; // 与y轴的截距
    
    isVerticalLine: boolean = false;
    verticalX: number;

    constructor ({p1, p2}: {p1: IPoint, p2}) {
        super();
        const xDiff = p1.x - p2.x;
        if (xDiff === 0) {
            this.isVerticalLine = true;
            this.verticalX = p1.x;
        } else {
            this.slope = (p1.y - p2.y) / xDiff;
            this.intercept = (p2.y * p1.x - p1.y * p2.x) / xDiff;
        }
        this.start = new Point(p1);
        this.end = new Point(p2);
    }
    
    /**
     * 是否与另一条直线相交
    */
    isIntersectAnotherStraightLine (
        line: IStraightLine,
    ): boolean {
        return this.isVerticalLine ?
            line.isVerticalLine :
            this.slope !== line.slope;
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
    isContainPoint (point: IPoint): boolean {
        if (this.isVerticalLine) {
            return point.x === this.verticalX;
        }
        return point.y === this.slope * point.x + this.intercept;
    }

    // 是否平行于另一条线段
    isParallelAnotherLine (line: IStraightLine) {
        return this.isVerticalLine ?
            line.isVerticalLine :
            this.slope === line.slope;
    }

    // 是否重合于另一条线段
    isCoincideAnotherLine (line: IStraightLine) {
        return this.isParallelAnotherLine(line) && (
            this.isVerticalLine ?
                this.verticalX === line.verticalX :
                this.intercept === line.intercept
        );
    }
}