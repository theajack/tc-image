/*
 * @Author: theajack
 * @Date: 2021-08-12 23:21:02
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-12 23:33:18
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\polygon.ts
 */
import {ILine, IPoint, IPoints, IPolygon} from './graphs';
import {Graph} from './graph';

export class Polygon extends Graph implements IPolygon {
    
    points: IPoints;
    lines: ILine[];

    constructor (points: IPoints) {
        super();
        this.points = points;
    }

    isContainPoint (point: IPoint): boolean {

    }
}