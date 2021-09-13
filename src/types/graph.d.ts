

/*
 * @Author: theajack
 * @Date: 2021-08-12 23:50:40
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-12 17:22:22
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

export interface IRoundRect extends IRect {
    radius: number | number[];
}
export interface ICircle {
    center: IPoint;
    radius: number;
}

// 扇形
export interface IArc extends ISector {
}

export interface ISector extends ICircle {
    startDeg: number; // 起始角度
    endDeg: number; // 结束角度
}

export interface ILineSegment extends IStartEnd {
}

export interface IStraightLine {
    slope: number; // 斜率
    intercept: number; // 与y轴的截距
    isVerticalLine: boolean;
    verticalX: number;
}

export interface IPolygon {
    points: Array<IPoint>;
}