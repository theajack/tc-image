/*
 * @Author: theajack
 * @Date: 2021-08-13 00:39:23
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-13 00:51:28
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\draw\draw.d.ts
 */

import {IPoint} from './graph';
import {Canvas} from '../geometry/draw/canvas';


export interface ILayer {
    point: IPoint; // 起始点
    rotate: number; // 旋转角度
    scale: number; // 缩放
    width: number;
    height: number;
    canvas: Canvas;
}

export type TFillStyle = 'stroke' | 'fill';

export interface IDrawStyle {
    color?: string;
    lineWidth?: number;
    lineDash?: boolean | number[];
    fillStyle?: TFillStyle;
}

export type TLayer = number | ILayer;