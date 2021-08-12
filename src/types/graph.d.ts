/*
 * @Author: theajack
 * @Date: 2021-08-12 23:50:40
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-12 23:50:49
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\graph\graph.d.ts
 */

export interface IPoint {
    x: number;
    y: number;
}

export interface IPoints extends Array<IPoint> {}

export interface IRect {
    start: IPoint;
    end: IPoint;
}

export interface ICircle {
    center: IPoint;
    radius: number;
}

export interface ILine {
    start: IPoint;
    end: IPoint
    isIntersectAnthorLine(line: ILine): boolean;
}

export interface IPolygon {
    points: Array<IPoint>;
    isContainPoint(point: IPoint): boolean;
}