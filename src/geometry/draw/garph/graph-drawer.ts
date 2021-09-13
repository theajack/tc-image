import {Graph} from '../../graph/base/graph';

/*
 * @Author: tackchen
 * @Date: 2021-09-11 16:30:04
 * @LastEditors: tackchen
 * @LastEditTime: 2021-09-11 16:40:18
 * @FilePath: /tc-image/src/geometry/draw/garph/graph-drawer.ts
 * @Description: Coding something
 */

export abstract class GraphDrawer extends Graph {
    abstract draw (): void;
}