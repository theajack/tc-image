/*
 * @Author: theajack
 * @Date: 2021-08-12 23:21:02
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-09 02:21:46
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\graph\polygon.ts
 */
import {IPoint, IPolygon} from '../../types/graph';
import {Graph} from './graph';
import {Line} from './line';
import {clone} from '../../utils/util';
import {Rect} from './rect';
import {isOddNumber} from '../../utils/math';
export class Polygon extends Graph implements IPolygon {
    
    points: IPoint[];
    lines: Line[];
    boundary: Rect;

    constructor (points: IPoint[]) {
        super();
        if (points.length < 3) {throw new Error('Wrong Polygon');};
        this.points = points;
        this.lines = [];
        this.initBoundary(points[0]);
        points.forEach((point, index) => {
            this.expendBoundary(point);
            const nextIndex = (index < points.length - 1) ? (index + 1) : 0;
            const nextPoint = points[nextIndex];
            this.lines.push(new Line({
                start: point,
                end: nextPoint
            }));
        });
        this.boundary.reinitSize();
    }

    private expendBoundary (point: IPoint) {
        const {start, end} = this.boundary;
        if (point.x < start.x) start.x = point.x;
        else if (point.x > end.x) end.x = point.x;
        
        if (point.y < start.y) start.y = point.y;
        else if (point.y > end.y) end.y = point.y;
    }

    private initBoundary (point: IPoint) {
        this.boundary = new Rect({
            start: clone(point),
            end: clone(point)
        });
    }
    // bian
    isContainPoint (point: IPoint): boolean {
        // 如果点不在多边形边界 则返回false
        if (!this.boundary.isContainPoint(point)) return false;

        // 如果点在多边形的边上，则返回true
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].isContainPoint(point))
                return true;
        }
        // 射线法判断点是否在多边形内
        const {upLine, downLine} = this.createCheckLines(point);
        const [upPointNumber, downPointNumber] = this.countIntersectPointNumberWithLines([upLine, downLine]);
        
        return isOddNumber(upPointNumber) && isOddNumber(downPointNumber);
    }

    countIntersectPointNumberWithLine (anotherLine: Line) {
        let sum = 0;
        this.lines.forEach((line: Line, index: number) => {
            if (this.isAnotherLineCrossEdge(anotherLine, line, index)) {
                sum ++;
            }
        });
        return sum;
    }

    private prevLine (index: number|Line): Line {
        if (typeof index !== 'number') {
            index = this.lines.indexOf(index);
        }
        return this.lines[(index === 0 ? this.lines.length : index) - 1];
    }

    countIntersectPointNumberWithLines (lines: Line[]) {
        const sums: number[] = [];
        this.lines.forEach((line, lineIndex) => {
            lines.forEach((anotherLine, index) => {
                if (typeof sums[index] !== 'number') sums[index] = 0;
                if (this.isAnotherLineCrossEdge(anotherLine, line, lineIndex)) {
                    sums[index] ++;
                }
            });
        });
        return sums;
    }

    isAnotherLineCrossEdge (anotherLine: Line, edge: Line, edgeIndex?: number) {
        if (typeof edgeIndex !== 'number') edgeIndex = this.lines.indexOf(edge);
        
        const intersectResult = anotherLine.isIntersectAnotherLine(edge, {includeStartPoint: true});

        if (intersectResult.isTrue) {
            // 不与边的起点相交 或者 当前边终点与上一条非重合边的起点在线段两侧
            if (
                !intersectResult.isStartOnLine ||
                anotherLine.isSplit2Point(this.prevLine(edgeIndex).start, edge.end).isTrue
            ) {
                return true;
            }

            if (intersectResult.isStartOnLine) {
                let prevLine = this.prevLine(edgeIndex);
                while (prevLine.isCoincideAnotherLine(anotherLine)) {
                    prevLine = this.prevLine(prevLine);
                }
                if (anotherLine.isSplit2Point(prevLine.start, edge.end).isTrue) {
                    return true;
                }

                return false;
            }

            return true;

            // if(intersectResult.isStartOnLine){
            //     return false;
            // }

            // if (!intersectResult.isStartOnLine) {
            //     let prevLine = this.prevLine(edgeIndex);
            //     while (prevLine.isCoincideAnotherLine(anotherLine)) {
            //         prevLine = this.prevLine(edgeIndex);
            //     }

            //     if (anotherLine.isSplit2Point(prevLine.start, edge.end).isTrue) {
            //         return true;
            //     }
            // }
        }
        return false;
    }

    // 做一条与x轴垂直的线，取其被多边形边界分成的两条线段
    private createCheckLines (point: IPoint) {
        return {
            upLine: new Line({
                start: {
                    x: point.x,
                    y: this.boundary.start.y
                },
                end: clone(point)
            }),
            downLine: new Line({
                start: clone(point),
                end: {
                    x: point.x,
                    y: this.boundary.end.y
                },
            })
        };
    }
}

// const p = new Polygon([
//     {x: 0, y: 400},
//     {x: 400, y: 200},
//     {x: 200, y: 400},
//     {x: 400, y: 600}
// ]);

// p.isAnotherLineCrossEdge(
//     {
//         start: {x: 400, y: 400},
//         end: {x: 400, y: 0}
//     },
//     p.lines[1]
// );