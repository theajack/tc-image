/*
 * @Author: theajack
 * @Date: 2021-08-12 23:19:54
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-13 11:15:43
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\graph\line.ts
 */
import {Graph} from './graph';
import {ILine, IPoint} from '../../types/graph';

export class Line extends Graph implements ILine {
    
    start: IPoint;
    end: IPoint;
    
    constructor (start: IPoint, end: IPoint) {
        super();
        this.start = start;
        this.end = end;
    }

    isIntersectAnthorLine (line: ILine): boolean {
        console.log(line);
        return false;
    }
}