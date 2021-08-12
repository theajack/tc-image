/*
 * @Author: theajack
 * @Date: 2021-08-12 23:20:02
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-12 23:26:36
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\point.ts
 */

import {IPoint} from './graphs';
import {Graph} from './graph';

export class Point extends Graph implements IPoint {
    
    x: number;
    y: number;
    
    constructor (x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}