/*
 * @Author: theajack
 * @Date: 2021-08-12 23:54:12
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-13 00:49:06
 * @Description: Coding something
 * @FilePath: \tc-image\src\geometry\draw\stage.ts
 */

import {Layers} from './layers';

export class Stage {
    width: number;
    height: number;
    container: HTMLElement;
    layers: Layers;
    constructor ({
        width,
        height,
        container = 'body',
        createDefaultLayer = true
    }: {
        width: number;
        height: number;
        container?: string;
        createDefaultLayer?: boolean;
    }) {
        this.width = width;
        this.height = height;
        this.container = document.querySelector(container);
        this.layers = new Layers({
            width,
            height,
            container: this.container,
            createDefaultLayer
        });
    }

    
}