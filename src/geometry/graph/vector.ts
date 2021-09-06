/*
 * @Author: tackchen
 * @Date: 2021-09-05 00:56:48
 * @LastEditors: tackchen
 * @LastEditTime: 2021-09-05 01:14:31
 * @FilePath: /tc-image/src/geometry/graph/vector.ts
 * @Description: 向量
 */
import {IPoint} from '../../types/type';
import {sqrtSquareSum} from '../../utils/math';

export class Vector {
    x: number;
    y: number;
    constructor ({
        start = {x: 0, y: 0},
        end
    }: {
        start?: IPoint;
        end: IPoint
    }) {
        this.x = end.x - start.x;
        this.y = end.y - start.y;
    }

    // A dp B = |A||B|Cos(θ)
    dotProduct (vector: Vector): number {
        return this.x * vector.x + this.y * vector.y;
    }


    // A cp B = |A||B|Sin(θ)
    crossProduct (vector: Vector): number {
        return this.x * vector.y - this.y * vector.x;
    }

    // 模长
    module () {
        return sqrtSquareSum(this.x, this.y);
    }

    countDeg (vector: Vector): number {
        return Math.acos(
            this.dotProduct(vector) /
            (this.module() * vector.module())
        );
    }
}
