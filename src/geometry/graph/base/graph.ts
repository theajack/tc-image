import {IPoint} from '../../../types/graph';

/*
 * @Author: theajack
 * @Date: 2021-08-12 23:23:14
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-11 17:11:51
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/graph/base/graph.ts
 *
 * 图形类父类 坐标系为x轴正方向为竖直向下 y轴正方向为水平向右 z轴正方向为垂直平面向外
 */

export abstract class Graph {
    constructor (beforeInit?: (self: Graph) => void) {
        if (beforeInit) beforeInit(this);
    }
    abstract isContainPoint (point: IPoint): boolean;
}