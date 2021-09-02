/*
 * @Author: tackchen
 * @Date: 2021-08-28 22:37:16
 * @LastEditors: tackchen
 * @LastEditTime: 2021-09-03 00:16:22
 * @FilePath: /tc-image/src/render/render-rotater.ts
 * @Description: 图片三个方向旋转
 * 垂直屏幕是z轴
 * 水平是x轴
 * 竖直是y轴
 * 往右是0度 顺时针为正方向
 */

import {Renderer} from './renderer';
import {I3DPoint, IPoint, ISize, IBlock, IJson, IRGBA} from '../types/type';
import {rotate3DPoint} from '../utils/math';
import {traverseBlock, countAverageRgba, rgbaToColorArray} from '../utils/util';

export class Rotater {
    render: Renderer;
    deg: I3DPoint;
    
    constructor (render: Renderer) {
        this.render = render;
        this.deg = {x: 0, y: 0, z: 0};
    }

    private createAreaChecker () {
        const start: IPoint = {x: 0, y: 0};
        const end: IPoint = {x: 0, y: 0};
        return {
            check: (point: IPoint) => {
                if (point.x < start.x)  start.x = point.x;
                else if (point.x > end.x) end.x = point.x;
                if (point.y < start.y) start.y = point.y;
                else if (point.y > end.y) end.y = point.y;
            },
            countSize: (): ISize => {
                return {
                    width: end.x - start.x + 1,
                    height: end.y - start.y + 1,
                };
            },
            getBlock: (): IBlock => {
                return {start, end};
            }
        };
    }

    private createRotateMap () {
        const bgColor: IRGBA = {r: 255, g: 255, b: 255, a: 255};
        const list: IJson<IRGBA> = {};
        const geneKey = (point: IPoint) => `${point.x}_${point.y}`;
        // let lastColorExist = false;
        // let lastColor: IRGBA;
        const emptyPoint: string[] = [];
        return {
            add: (point: IPoint, rgba: IRGBA) => {
                const key = geneKey(point);
                if (!list[key]) {
                    list[key] = rgba;
                } else {
                    list[key] = countAverageRgba([list[key], rgba]);
                }
                //     list[key] = [];
                // list[key].push(rgba);
            },
            getColor: (point: IPoint, useAroundColor: boolean = true): IRGBA => {
                const key = geneKey(point);
                if (!list[key]) {
                    // if (lastColorExist) {
                    //     lastColorExist = false;
                    //     return lastColor;
                    // }
                    emptyPoint.push(key);
                    if (useAroundColor) {
                        const array: IRGBA[] = [];
                        traverseBlock({
                            block: {
                                start: {x: point.x - 1, y: point.y - 1},
                                end: {x: point.x + 1, y: point.y + 1},
                            },
                            callback: (p) => {
                                const pKey = geneKey(p);
                                if (pKey === key) return;
                                array.push(list[pKey] || bgColor);
                            }
                        });
                        const color = countAverageRgba(array);
                        list[key] = color;
                        return color;
                    }
                    return bgColor;
                }
                // lastColor = countAverageRgba(list[key]);
                // lastColorExist = true;
                return list[key];
            }
        };
    }
    // private createRotateMap2 () {
    //     const bgColor: IRGBA = {r: 255, g: 255, b: 255, a: 255};
    //     const list: IJson<IRGBA> = {};
    //     const geneKey = (point: IPoint) => `${point.x}_${point.y}`;
    //     // let lastColorExist = false;
    //     // let lastColor: IRGBA;
    //     const emptyPoint: string[] = [];
    //     return {
    //         add: (point: IPoint, rgba: IRGBA) => {
    //             const key = geneKey(point);
    //             if (!list[key]) {
    //                 list[key] = rgba;
    //             } else {
    //                 list[key] = countAverageRgba([list[key], rgba]);
    //             }
    //             //     list[key] = [];
    //             // list[key].push(rgba);
    //         },
    //         getColor: (point: IPoint, useAroundColor: boolean = true): IRGBA => {
    //             const key = geneKey(point);
    //             if (!list[key]) {
    //                 // if (lastColorExist) {
    //                 //     lastColorExist = false;
    //                 //     return lastColor;
    //                 // }
    //                 emptyPoint.push(key);
    //                 if (useAroundColor) {
    //                     const array: IRGBA[] = [];
    //                     traverseBlock({
    //                         block: {
    //                             start: {x: point.x - 1, y: point.y - 1},
    //                             end: {x: point.x + 1, y: point.y + 1},
    //                         },
    //                         callback: (p) => {
    //                             const pKey = geneKey(p);
    //                             if (pKey === key) return;
    //                             array.push(list[pKey] || bgColor);
    //                         }
    //                     });
    //                     const color = countAverageRgba(array);
    //                     list[key] = color;
    //                     return color;
    //                 }
    //                 return bgColor;
    //             }
    //             // lastColor = countAverageRgba(list[key]);
    //             // lastColorExist = true;
    //             return list[key];
    //         }
    //     };
    // }

    private countPointByOrigin (point: IPoint): IPoint {
        const offsetX = this.render.originWidth / 2;
        const offsetY = this.render.originHeight / 2;
        return {
            x: point.x - 1 - offsetX,
            y: point.y - 1 - offsetY,
        };
    }

    private runRotate () {

        const AreaChecker = this.createAreaChecker();
        const RotateMap = this.createRotateMap();
        this.render.loader.traverseImage(point => {
            const point3D = rotate3DPoint({
                ...this.countPointByOrigin(point),
                z: 0
            }, this.deg);
            const rgba = this.render.loader.getRgbaByPoint(point);
            RotateMap.add(point3D, rgba);
            AreaChecker.check(point3D);
        });

        const size = AreaChecker.countSize();
        this.render.initRenderSize(size);
        
        const block = AreaChecker.getBlock();
        const newImageData: number[] = [];
        traverseBlock({
            block,
            callback: (point) => {
                const rgba = RotateMap.getColor(point);
                newImageData.push(...rgbaToColorArray(rgba));
            }
        });
        this.render.setImageData(newImageData);
    }

    resetRotate () {
        this.deg = {x: 0, y: 0, z: 0};
        this.runRotate();
    }

    rotate3D ({
        x = 0, y = 0, z = 0
    }: {
        x?: number; y?: number; z?: number
    }) {
        this.deg.x += x;
        this.deg.y += y;
        this.deg.z += z;
        this.runRotate();
    }

    rotate (anticlockwise = false) {
        this.deg.z += (anticlockwise ? -90 : 90);
        this.runRotate();
    }

    flip (vertical = false) {
        this.deg[vertical ? 'x' : 'y'] += 180;
        this.runRotate();
    }
}

/**
1、通过input上传图片，使用FileReader将文件读取到内存中。

2、将图片转换为canvas，canvas.toDataURL()方法设置为我们需要的格式，如："image/webp","image/jpeg","image/png"。

3、最后将canvas转换为图片，显示在网页中。点击右键保存，就得到了不同格式的图片了。

toDataURL说明：
方法返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。图片的分辨率为96dpi。

语法：

canvas.toDataURL(type, encoderOptions);

type【可选】 图片格式，默认为 image/png，可选格式："image/webp","image/jpeg","image/png"。

encoderOptions【可选】在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
 */