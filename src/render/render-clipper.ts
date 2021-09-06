/*
 * @Author: tackchen
 * @Date: 2021-09-05 00:32:45
 * @LastEditors: tackchen
 * @LastEditTime: 2021-09-05 00:36:17
 * @FilePath: /tc-image/src/render/render-clipper.ts
 * @Description: Coding something
 */
import {Renderer} from './renderer';
import {IRGBA} from '../types/type';

export class Clipper {
    render: Renderer;
    bgColor: IRGBA = {r: 255, g: 255, b: 255, a: 255};
    
    constructor (render: Renderer) {
        this.render = render;
    }
}