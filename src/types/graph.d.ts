

/*
 * @Author: theajack
 * @Date: 2021-08-12 23:50:40
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-06 22:08:28
 * @Description: Coding something
 * @FilePath: /tc-image/src/types/graph.d.ts
 */
export interface IStartEnd {
    start: IPoint;
    end: IPoint
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IPoints extends Array<IPoint> {}

export interface IRect extends IStartEnd {
}

export interface ICircle {
    center: IPoint;
    radius: number;
}

export interface ILine extends IStartEnd {
}

export interface IPolygon {
    points: Array<IPoint>;
}