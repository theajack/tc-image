import {ImageLoader} from './image-loader';
import {creatEventReady, IEventReady, IEventReadyListener} from '../utils/event';
import {canvasToImageBase64, createEmptyCanvas, imageBase64ToBlobUrl} from '../utils/transform';
import {IRGBA, IPoint, IRGB, ISize, IOptionSize, IBlock} from '../types/type';
import {rgbaToColorArray, rgbToColorArray, traverseBlock, countScaleMap} from '../utils/util';
import {grayRRBA, reverseRGBA} from './filter';
import {gaussFunc} from '../utils/math';
import {Rotater} from './render-rotater';
import {Clipper} from './render-clipper';

/*
 * @Author: tackchen
 * @Date: 2021-08-08 09:50:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-08 22:55:23
 * @FilePath: /tc-image/src/render/renderer.ts
 * @Description: Coding something
 */

export class Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    originWidth: number;
    originHeight: number;
    rate: number;
    loader: ImageLoader;
    eventReady: IEventReady;
    processImageData: ImageData;
    rotater: Rotater;
    clipper: Clipper;
    private downloadLink: HTMLAnchorElement;
    constructor ({
        container = '',
        image = '',
        oninited
    }: {
        container?: string;
        image: string | HTMLImageElement;
        oninited?: () => void;
    }) {
        // loaded 后于 inited 执行
        this.eventReady = creatEventReady();
        this.loader = new ImageLoader({
            image,
            onloaded: () => {
                const width = this.loader.imageWidth;
                const height = this.loader.imageHeight;
                this.originWidth = width;
                this.originHeight = height;
                this.initRenderSize({width, height});
                this.context.drawImage(this.loader.image, 0, 0, width, height);
                this.eventReady.eventReady();
            },
            oninited: () => {
                const width = this.loader.imageWidth;
                const height = this.loader.imageHeight;
                const {canvas, context} = createEmptyCanvas(width, height);
                this.canvas = canvas;
                this.context = context;
                if (container) {
                    document.querySelector(container)?.appendChild(this.canvas);
                }
                if (oninited) {oninited();}
            }
        });
        this.rotater = new Rotater(this);
        this.clipper = new Clipper(this);
    }

    initRenderSize ({width, height}: ISize) {
        if (width === this.width && height === this.height) {
            return;
        }
        this.width = width;
        this.height = height;
        this.rate = width / height;
        this.processImageData = new ImageData(width, height);
        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }

    onLoaded (listener: IEventReadyListener) {
        this.eventReady.onEventReady(listener);
    }

    private traverse (callback: (rgba: IRGBA, point: IPoint)=>number[]) {
        let offset = 0;
        this.loader.traverseImage((point) => {
            const rgba = this.loader.getRgbaByPoint(point);
            const array = callback(rgba, point);
            this.setProcessImageData(array, offset);
            offset += array.length;
        });

        this.putProcessDataIntoCanvas();
    }

    setImageData (data: Uint8Array | number[]) {
        this.setProcessImageData(data, 0);
        this.putProcessDataIntoCanvas();
    }

    private setProcessImageData (data: Uint8Array | number[], offset: number) {
        this.processImageData.data.set(data, offset);
    }

    // private setSinglePointProcessImageData (point: IPoint, rgba: IRGBA) {
    //     this.setProcessImageData(
    //         rgbaToColorArray(rgba),
    //         pointToIndex(point, this.width)
    //     );
    // }

    private putProcessDataIntoCanvas () {
        this.context.putImageData(this.processImageData, 0, 0);
    }

    private traverseFilterColor ({
        target, callback, throsold = 50
    }: {
        target: IRGB,
        callback: (rgba: IRGBA, point: IPoint)=>number[],
        throsold?: number,
    }) {
        this.traverse((rgba, point) => {
            if (
                Math.abs(rgba.r - target.r) <= throsold &&
                Math.abs(rgba.g - target.g) <= throsold &&
                Math.abs(rgba.b - target.b) <= throsold
            ) {
                return callback(rgba, point);
            } else {
                return rgbaToColorArray(rgba);
            }
        });
    }

    gray () {
        this.traverse((rgba) => {
            return rgbaToColorArray(grayRRBA(rgba));
        });
    }

    reverse () {
        this.traverse((rgba) => {
            return rgbaToColorArray(reverseRGBA(rgba));
        });
    }

    mosaic (size = 20) {
        this.loader.traverseImageByBlock(size, (block) => {
            const rgba = this.loader.countBlockAverageRgba(block);
            const rgbaArray = rgbaToColorArray(rgba);
            traverseBlock({
                block,
                callback: (point) => {
                    const offset = this.loader.countOffsetByPoint(point);
                    this.setProcessImageData(rgbaArray, offset);
                }
            });
        });
        this.putProcessDataIntoCanvas();
    }

    blur (radius = 5) {
        this.traverse((rgba, point) => {
            const block = this.loader.getBlockByCenterPoint({point, radius});
            const aveRgba = this.loader.countBlockAverageRgba(block);
            return rgbaToColorArray(aveRgba);
        });
    }

    download (filename = 'image.png') {
        if (!this.downloadLink) {
            this.downloadLink = document.createElement('a');
            this.downloadLink.setAttribute('style', 'position:fixed;left:-100;opacity:0');
            this.downloadLink.innerText = 'download';
            document.body.appendChild(this.downloadLink);
        }
        const base64 = canvasToImageBase64(this.canvas);
        this.downloadLink.href = imageBase64ToBlobUrl(base64);
        this.downloadLink.download = filename;
        this.downloadLink.click();
    }

    // gaussBlur2 (radius = 5) {
    //     const gaussMap = gaussFunc(radius);
    //     const asmLoader = window.asmLoader;
    //     const newImageData: Uint8Array = asmLoader.transform.asmU8ArrToU8Arr(
    //         asmLoader.module.gaussBlur(
    //             asmLoader.transform.arrToAsmF32Arr(gaussMap),
    //             asmLoader.transform.arrToAsmU8Arr(this.loader.imageData.data),
    //             this.width,
    //             this.height,
    //             radius
    //         )
    //     );
    //     this.setImageData(newImageData);
    // }

    gaussBlur (radius = 5) {
        const gaussMap = gaussFunc(radius);
        this.traverse((rgba, point) => {
            const block = this.loader.getBlockByCenterPoint({point, radius, checkOutBorder: false});
            const rgbaSum: IRGBA = {r: 0, g: 0, b: 0, a: 0};
            traverseBlock({
                block,
                callback: (point, index) => {
                    const rgba = this.loader.getRgbaByPoint(point, true);
                    const gaussWeight = gaussMap[index];
                    rgbaSum.r += (gaussWeight * rgba.r);
                    rgbaSum.g += (gaussWeight * rgba.g);
                    rgbaSum.b += (gaussWeight * rgba.b);
                    rgbaSum.a += (gaussWeight * rgba.a);
                }
            });
            return rgbaToColorArray(rgbaSum);
        });
    }
    replaceColor ({
        target, replacement, throsold = 50
    }: {
        target: IRGB,
        replacement: IRGB,
        throsold?: number,
    }) {
        this.traverseFilterColor({
            target,
            throsold,
            callback: () => {
                return rgbToColorArray(replacement);
            }
        });
    }
    
    replaceColorWithImage ({
        target, image, throsold = 50
    }: {
        target: IRGB,
        image: HTMLImageElement | string,
        throsold?: number,
    }) {
        const loader = new ImageLoader({
            image,
            onloaded: () => {
                this.traverseFilterColor({
                    target,
                    throsold,
                    callback: (rgba, point) => {
                        const replaceRgba = loader.getRgbaByPoint(point);
                        return rgbToColorArray((typeof replaceRgba.r === 'undefined') ? rgba : replaceRgba);
                    }
                });
            }
        });
    }

    private formatSize (size: IOptionSize): ISize {
        const isWidthNum = typeof size.width === 'number';
        const isHeightNum = typeof size.height === 'number';
        if (!isWidthNum && !isHeightNum) {
            return {
                width: this.originWidth,
                height: this.originHeight
            };
        } else if (isWidthNum && isHeightNum) {
        } else if (isWidthNum) {
            size.height = Math.round((size.width as number) / this.rate);
        } else {
            size.width = Math.round((size.height as number) * this.rate);
        }
        return size as ISize;
    }

    setImageSize (optionSize: IOptionSize) {
        const size = this.formatSize(optionSize);
        const xMap = countScaleMap(this.originWidth, size.width);
        const yMap = countScaleMap(this.originHeight, size.height);
        this.initRenderSize(size);
        const data: number[] = [];
        traverseBlock({
            block: {
                start: {x: 1, y: 1},
                end: {x: size.width, y: size.height}
            },
            callback: (point) => {
                const xIndex = point.x - 1;
                const yIndex = point.y - 1;
                const block: IBlock = {
                    start: {x: xMap[xIndex][0], y: yMap[yIndex][0]},
                    end: {x: xMap[xIndex][1], y: yMap[yIndex][1]}
                };
                data.push(...rgbaToColorArray(this.loader.countBlockAverageRgba(block)));
            }
        });
        this.setImageData(data);
    }

    setImageScale (scale: number) {
        this.setImageScaleXY({x: scale, y: scale});
    }

    setImageScaleXY ({x, y}: IPoint) {
        this.setImageSize({
            width: this.originWidth * x,
            height: this.originHeight * y
        });
    }

    save () {
        const base64 = canvasToImageBase64(this.canvas);
        this.loader.loadImage(base64);
    }
}