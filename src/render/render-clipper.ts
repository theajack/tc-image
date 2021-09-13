/*
 * @Author: tackchen
 * @Date: 2021-09-05 00:32:45
 * @LastEditors: tackchen
 * @LastEditTime: 2021-09-11 15:47:09
 * @FilePath: /tc-image/src/render/render-clipper.ts
 * @Description: Coding something
 */
import {Renderer} from './renderer';
import {IPoint, IRGBA} from '../types/type';
import {IRect, ICircle} from '../types/graph';
import {Rect} from '../geometry/graph/closed-graphs/rect';
import {Polygon} from '../geometry/graph/closed-graphs/polygon';
import {Circle} from '../geometry/graph/closed-graphs/circle';
import {rgbaToColorArray} from '../utils/util';

export class Clipper {
    render: Renderer;
    bgColor: IRGBA = {r: 255, g: 255, b: 255, a: 255};
    
    constructor (render: Renderer) {
        this.render = render;
    }

    private clipBase ({
        rect,
        checkContainPoint,
    }: {
        rect: Rect
        checkContainPoint?: (point: IPoint)=>boolean | boolean;
    }) {
        this.render.initRenderSize(rect.size);
        const newImageData: number[] = [];
        this.render.loader.traverseImageInRect(rect, (point) => {
            const isContain = checkContainPoint && checkContainPoint(point);
            const rgba = isContain ? this.render.loader.getRgbaByPoint(point) : this.bgColor;
            newImageData.push(...rgbaToColorArray(rgba));
        });
        this.render.setImageData(newImageData);
    }

    clipRect (iRect: IRect) {
        const rect = new Rect(iRect);
        this.clipBase({rect});
    }

    clipPolygon (points: IPoint[]) {
        const polygon = new Polygon(points);

        this.clipBase({
            rect: polygon.boundary,
            checkContainPoint: point => polygon.isContainPoint(point)
        });
    }

    clipCircle (iCircle: ICircle) {
        const circle = new Circle(iCircle);

        this.clipBase({
            rect: circle.boundary,
            checkContainPoint: point => circle.isContainPoint(point)
        });
    }
}