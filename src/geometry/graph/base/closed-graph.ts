/*
 * @Author: tackchen
 * @Date: 2021-09-11 16:45:01
 * @LastEditors: tackchen
 * @LastEditTime: 2021-09-12 17:06:18
 * @FilePath: /tc-image/src/geometry/graph/base/closed-graph.ts
 * @Description: 封闭图形
 */
import {Rect} from '../closed-graphs/rect';
import {traverseBlock} from '../../../utils/util';
import {Graph} from './graph';
import {IPoint} from '../../../types/graph';

export abstract class ClosedGraph extends Graph {
    boundary: Rect;
    area: number = -1;
    girth: number = 0;
    constructor (beforeInit?: (self: Graph)=>void) {
        super(beforeInit);
    }
    countArea () {
        const area = 0;
        traverseBlock({
            block: {
                start: this.boundary.start,
                end: this.boundary.end,
            },
            callback: (point: IPoint) => {
                if (this.isContainPoint(point)) {
                    area;
                }
            }
        });
        this.area = area;
        return area;
    }
    // 有待在子类中实现
    countGirth (): number {
        this.girth = 0;
        return 0;
    }
    protected abstract countBoundary (): Rect;
}