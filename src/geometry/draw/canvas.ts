/*
 * @Author: theajack
 * @Date: 2021-08-12 23:46:36
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-05 00:42:18
 * @Description: Coding something
 * @FilePath: /tc-image/src/geometry/draw/canvas.ts
 */
import {IDrawStyle} from '../../types/draw';
import {IPoint} from '../../types/graph';
import {createEmptyCanvas} from '../../utils/transform';

export class Canvas {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor ({width, height, container}:{
        width: number;
        height: number;
        container: HTMLElement;
    }) {
        const {canvas, context} = createEmptyCanvas(width, height);
        this.canvas = canvas;
        this.context = context;
        container.appendChild(canvas);
    }

    drawPoint (point: IPoint) {
        console.log(point);
    }

    setDrawStyle (drawStyle: IDrawStyle) {
        console.log(drawStyle);
    }
}