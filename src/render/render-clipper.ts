/*
 * @Author: tackchen
 * @Date: 2021-09-05 00:32:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-09 01:37:46
 * @FilePath: \tc-image\src\render\render-clipper.ts
 * @Description: Coding something
 */
import {Renderer} from './renderer';
import {IPoint, IRGBA} from '../types/type';
import {IRect} from '../types/graph';
import {Rect} from '../geometry/graph/rect';
import {Polygon} from '../geometry/graph/polygon';
import {rgbaToColorArray} from '../utils/util';

export class Clipper {
    render: Renderer;
    bgColor: IRGBA = {r: 255, g: 255, b: 255, a: 255};
    
    constructor (render: Renderer) {
        this.render = render;
    }

    clipRect (irect: IRect) {
        const rect = new Rect(irect);
        this.render.initRenderSize(rect.size);

        const newImageData: number[] = [];
        
        this.render.loader.traverseImageInRect(rect, (point) => {
            const rgba = this.render.loader.getRgbaByPoint(point);
            newImageData.push(...rgbaToColorArray(rgba));
        });

        this.render.setImageData(newImageData);
    }

    clipPolygon (points: IPoint[]) {
        const polygon = new Polygon(points);
        this.render.initRenderSize(polygon.boundary.size);

        const newImageData: number[] = [];

        this.render.loader.traverseImageInRect(polygon.boundary, (point) => {
            let rgba: IRGBA;
            if (polygon.isContainPoint(point)) {
                rgba = this.render.loader.getRgbaByPoint(point);
            } else {
                rgba = this.bgColor;
            }
            newImageData.push(...rgbaToColorArray(rgba));
        });
        this.render.setImageData(newImageData);
    }
}