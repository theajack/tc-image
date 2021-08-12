/*
 * @Author: theajack
 * @Date: 2021-08-13 00:07:01
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-13 00:51:22
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\draw\layer.ts
 */

import {IPoint} from '../../types/graph';
import {Canvas} from './canvas';
import {ILayer} from '../../types/draw';

export class Layer implements ILayer {
    point: IPoint; // 起始点
    rotate: number; // 旋转角度
    scale: number; // 缩放
    width: number;
    height: number;
    canvas: Canvas;
    constructor ({width, height, container}:{
        width: number;
        height: number;
        container: HTMLElement;
    }) {
        
        this.canvas = new Canvas({
            width, height, container
        });
        
    }
}