/*
 * @Author: tackchen
 * @Date: 2021-08-09 11:01:30
 * @LastEditors: tackchen
 * @FilePath: \tc-image\src\math.ts
 * @Description: Coding something
 */

import {IBlock, IJson, IPos} from './type';
import {extractBlockXArray, traverseBlock} from './util';

// 使用原生比使用数组的速度更快

/**
 * http://www.ruanyifeng.com/blog/2012/11/gaussian_blur.html
 * 二维正态分布，其实应该有μ1,μ2,σ1,σ2,ρ五个变量，
 * 这里是特殊情况，x,y独立ρ=0， μ1,μ2=0，σ1,σ2相等
 */


/**
 *
 *
 * @export
 * @param {IBlock} block
 * @return {weightMap}  {IJson<number>} // x_y: weight
 */
export function gaussFunc (block: IBlock): IJson<number> {
    const data = extractBlockXArray(block); // x坐标与中心点的差值数组

    const sd = standardDeviation(data); // 标准差

    const weightMap: IJson<number> = {};
    let weightSum = 0;
    traverseBlock({
        block,
        callback (pos) {
            const weight = countGaussWeight(pos, sd);
            weightMap[`${pos.x}_${pos.y}`] = weight;
            weightSum += weightSum;
        }
    });
    for (const k in weightMap) {
        weightMap[k] /= weightSum;
    }
    return weightMap;
}

function countGaussWeight (pos: IPos, sd: number) {
    const k = 1 / (2 * Math.PI * sd);
    const pow = - (pos.x * pos.x + pos.y * pos.y) / (2 * sd);
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