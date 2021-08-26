/*
 * @Author: theajack
 * @Date: 2021-08-12 23:18:21
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-25 21:00:01
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/index.ts
 */

import {IPoints} from '../types/graph';
import {Point} from './graph/point';
import {Polygon} from './graph/polygon';

export const Geometry = {
    
    stage () {
        
    },

    point (x: number, y: number) {
        return new Point(x, y);
    },

    polygon (points: IPoints) {
        return new Polygon(points);
    }
};