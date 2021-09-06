/*
 * @Author: theajack
 * @Date: 2021-08-12 23:20:02
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-06 22:16:17
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/graph/point.ts
 */

import {IPoint} from '../../types/graph';
import {Graph} from './graph';

export class Point extends Graph implements IPoint {
    
    x: number;
    y: number;
    
    constructor (point: IPoint) {
        super();
        this.x = point.x;
        this.y = point.y;
    }
}