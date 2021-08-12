/*
 * @Author: theajack
 * @Date: 2021-08-13 00:14:31
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-13 00:53:53
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\draw\layers.ts
 */

import {IDrawStyle, TLayer} from '../../types/draw';
import {IPoint} from '../../types/graph';
import {Layer} from './layer';

export class Layers {
    activeIndex: number;
    layers: Layer[];
    width: number;
    height: number;
    constructor ({
        width,
        height,
        container,
        createDefaultLayer
    }: {
        width: number;
        height: number;
        container: HTMLElement;
        createDefaultLayer: boolean;
    }) {
        this.layers = [];
        if (createDefaultLayer) {
            this.appendNewLayer(new Layer({
                width, height, container
            }));
        }
    }
    
    private getLayer (layer: TLayer = this.activeIndex) {
        return (typeof layer === 'number') ? this.getLayerByIndex(layer) : layer;
    }

    private getCanvas (layer?: TLayer) {
        return this.getLayer(layer).canvas;
    }

    getLayerByIndex (index: number) {
        return this.layers[index];
    }

    getTopLayer () {
        return this.getLayerByIndex(this.layers.length - 1);
    }

    getBottomLayer () {
        return this.getLayerByIndex(0);
    }

    getActiveLayer () {
        return this.getLayerByIndex(this.activeIndex);
    }

    appendNewLayer (layer: Layer, active: boolean = true) {
        this.layers.push(layer);
        if (active) {
            this.activeTopLayer();
        }
    }

    activeTopLayer () {
        this.activeIndex = this.layers.length - 1;
    }
    
    drawPoint (point: IPoint, layer?: TLayer) {
        this.getCanvas(layer).drawPoint(point);
    }

    setDrawStyle (drawStyle: IDrawStyle, layer?: TLayer) {
        this.getCanvas(layer).setDrawStyle(drawStyle);
    }
}