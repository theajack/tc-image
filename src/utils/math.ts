/*
 * @Author: tackchen
 * @Date: 2021-08-09 11:01:30
 * @LastEditors: tackchen
 * @FilePath: /tc-image/src/utils/math.ts
 * @Description: Coding something
 */

import {IBlock, IPoint, I3DPoint, I2DPoint, I3DDeg} from '../types/type';
import {extractBlockCenterPoint, extractBlockXArray, traverseBlock} from './util';

// 使用原生比使用数组的速度更快

/**
 * http://www.ruanyifeng.com/blog/2012/11/gaussian_blur.html
 * 二维正态分布，其实应该有μ1,μ2,σ1,σ2,ρ五个变量，
 * 这里是特殊情况，x,y独立ρ=0， μ1,μ2=0，σ1,σ2相等
 */


/**
 * @export
 * @param {IBlock} block
 * @return {weightMap}  {IJson<number>} // x_y: weight
 */
export function gaussFunc (radius: number): Array<number> {
    const block: IBlock = {
        start: {x: 1, y: 1},
        end: {x: 1 + radius * 2, y: 1 + radius * 2}
    };
    const data = extractBlockXArray(block); // x坐标与中心点的差值数组
    const sd = standardDeviation(data); // 标准差

    const weightMap: number[] = [];
    let weightSum = 0;
    const center = extractBlockCenterPoint(block);
    traverseBlock({
        block,
        callback (point) {
            const weight = countGaussWeight({
                x: point.x - center.x,
                y: point.y - center.y
            }, sd);
            weightMap.push(weight);
            weightSum += weight;
        }
    });
    for (let i = 0; i < weightMap.length; i++) {
        weightMap[i] /= weightSum;
    }
    return weightMap;
}
window.gaussFunc = gaussFunc;

function countGaussWeight (point: IPoint, sd: number) {
    const k = 1 / (2 * Math.PI * sd);
    const pow = - (point.x * point.x + point.y * point.y) / (2 * sd);
    return k * Math.pow(Math.E, pow);
};

export function sum (data: number[]) {
    // return data.reduce((a, b) => a + b);
    // 下面的代码速度会更快
    let sum = 0;
    for (let i = 0; i < data.length; i++)
        sum += data[i];
    return sum;
}

/**
 * 平均值
 */
export function average (data: number[]) {
    return sum(data) / data.length;
}

/**
 * 方差
 */
export function variance (data: number[]) {
    return Math.sqrt(standardDeviation(data));
}

/**
 * 标准差
 */
export function standardDeviation (data: number[]) {
    // return Math.sqrt(numbers.map(n=> (n-avg) * (n-avg)).reduce(sum) / len);
    const avg = average(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++)
        sum += (data[i] - avg) * (data[i] - avg);
    return sum / data.length;
}

export function max (data: number[]) {
    return Math.max.apply(null, data);
}
export function min (data: number[]) {
    return Math.min.apply(null, data);
}

export function degToRad (deg: number) {
    return deg * Math.PI / 180;
}

export function radToDeg (rad: number) {
    return rad * 180 / Math.PI;
}

/**
 * 在某个平面旋转某个点
 * point.x 表示该平面横轴
 * point.y 表示该平面纵轴
 * @param point
 * @param deg
 */
export function rotatePoint (point: I2DPoint, deg: number): I2DPoint {
    const lastDeg = Math.atan2(point.v, point.h);
    const rad = degToRad(deg) + lastDeg;
    return countPointByRad({
        point,
        rad
    });
}
window.rotate3DPoint = rotate3DPoint;
export function rotate3DPoint (point3D: I3DPoint, deg: I3DDeg, round: boolean = false): I3DPoint {
    const result3DPoint: I3DPoint = {...point3D};
    if (deg.z !== 0) {
        // h=>x v=>y
        const zPoint = rotatePoint({
            h: result3DPoint.x,
            v: result3DPoint.y
        }, deg.z);
        result3DPoint.x = zPoint.h;
        result3DPoint.y = zPoint.v;
    }

    if (deg.y !== 0) {
        // h=>z v=>x
        const yPoint = rotatePoint({
            h: result3DPoint.z,
            v: result3DPoint.x,
        }, deg.y);
        result3DPoint.x = yPoint.v;
        result3DPoint.z = yPoint.h;
    }

    if (deg.x !== 0) {
        // h=>y v=>z
        const xPoint = rotatePoint({
            h: result3DPoint.y,
            v: result3DPoint.z,
        }, deg.x);
        result3DPoint.y = xPoint.h;
        result3DPoint.z = xPoint.v;
    }
    return round ? mathRound3DPoint(result3DPoint) : result3DPoint;
    // return mathRound3DPoint(result3DPoint);
}

window.rotate3DPoint = rotate3DPoint;


export function countRadius (point: I2DPoint) {
    return sqrtSquareSum(point.h, point.v);
}

// 求两个数的平方和 开根号
export function sqrtSquareSum (a: number, b: number) {
    return Math.sqrt(a * a + b * b);
}

export function countPointByDeg ({
    radius, point, deg
}:{
    radius?: number;
    point?: I2DPoint;
    deg: number;
}): I2DPoint {
    return countPointByRad({radius, point, rad: degToRad(deg)});
}

export function countPointByRad ({
    radius, point, rad
}:{
    radius?: number;
    point?: I2DPoint;
    rad: number;
}): I2DPoint {
    if (!radius) {
        radius = countRadius(point as I2DPoint);
    }
    return {
        h: radius * Math.cos(rad),
        v: radius * Math.sin(rad),
    };
}

export function parseDeg (deg: number) {
    return deg % 360;
}
export function parseRad (rad: number) {
    return rad % (2 * Math.PI);
}

export function countCircleArea (radius: number) {
    return Math.PI * radius * radius;
}

export function mathRoundPoint (point: IPoint) {
    point.x = Math.round(point.x);
    point.y = Math.round(point.y);
    return point;
}

export function mathRound2DPoint (point: I2DPoint) {
    point.h = Math.round(point.h);
    point.v = Math.round(point.v);
    return point;
}

export function mathRound3DPoint (point: I3DPoint) {
    point.x = Math.round(point.x);
    point.y = Math.round(point.y);
    point.z = Math.round(point.z);
    return point;
}

export function spread2DFloatPoint (
    point: IPoint,
    accuracy: number = 0.5, // 精度
):IPoint[] {
    const spreadX = spreadNumber(point.x, accuracy);
    const spreadY = spreadNumber(point.y, accuracy);
    const result: IPoint[] = [];

    spreadY.forEach(y => {
        spreadX.forEach(x => {
            result.push({x, y});
        });
    });
    return result;
}

window.spread2DFloatPoint = spread2DFloatPoint;
// accuracy 精度取值范围为0-1
// 1表示区间内单位区间内任意点都会被展开成两个点
// 0表示区间内单位区间内任意点只会取靠近的点
function spreadNumber (v: number, accuracy: number = 0.5): number[] {
    const ceil = Math.ceil(v);
    const floor = Math.floor(v);
    if (ceil === floor) {
        return [floor];
    }

    const center = (floor + ceil) / 2;

    if (Math.abs(v - center) < (accuracy / 2)) {
        return [floor, ceil];
    }
    return [Math.round(v)];
}
window.spreadNumber = spreadNumber;

export function isSameSign (
    a: number,
    b: number,
    zero: boolean = false, // zero = true 表示任何数都与0同号
): boolean {
    return zero ? (a * b >= 0) : (a * b > 0);
}

export function isEvenNumber (value: number) {
    return !isOddNumber(value);
}

export function isOddNumber (value: number) {
    return value % 2 === 1;
}

export function count2PointDeg (p1: IPoint, p2: IPoint) {
    return radToDeg(Math.atan2(p1.y - p2.y, p1.x - p2.x));
}