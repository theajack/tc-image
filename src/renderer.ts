import {ImageLoader} from './image-loader';
import {creatEventReady, IEventReady, IEventReadyListener} from './event';
import {canvasToImageBase64, createEmptyCanvas, imageBase64ToBlobUrl} from './transform';
import {IRGBA, IPoint, IRGB} from './type';
import {rgbaToColorArray, rgbToColorArray, traverseBlock} from './util';
import {grayRRBA, reverseRGBA} from './filter';
import {gaussFunc} from './math';

/*
 * @Author: tackchen
 * @Date: 2021-08-08 09:50:51
 * @LastEditors: tackchen
 * @LastEditTime: 2021-08-12 17:44:43
 * @FilePath: \tc-image\src\renderer.ts
 * @Description: Coding something
 */

export class Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    loader: ImageLoader;
    eventReady: IEventReady;
    processImageData: ImageData;
    private downloadLink: HTMLAnchorElement;
    constructor ({
        container = '',
        image = ''
    }: {
        width?: number;
        height?: number;
        container?: string;
        image: string | HTMLImageElement
    }) {

        this.eventReady = creatEventReady();
        this.loader = new ImageLoader({
            image,
            onloaded: () => {
                this.width = this.loader.imageWidth;
                this.height = this.loader.imageHeight;
                this.processImageData = new ImageData(this.width, this.height);
                const {canvas, context} = createEmptyCanvas(this.width, this.height);
                this.canvas = canvas;
                this.context = context;
                
                this.context.drawImage(this.loader.image, 0, 0, this.width, this.height);
                if (container) {
                    document.querySelector(container)?.appendChild(this.canvas);
                }
                this.eventReady.eventReady();
            }
        });
        
    }

    onLoaded (listener: IEventReadyListener) {
        this.eventReady.onEventReady(listener);
    }

    private traverse (callback: (rgba: IRGBA, point: IPoint)=>number[]) {
        let offset = 0;
        this.loader.traverseImage((point) => {
            const rgba = this.loader.getRgbaByPoint(point);
            const array = callback(rgba, point);
            this.processImageData.data.set(array, offset);
            offset += array.length;
        });

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
                    this.processImageData.data.set(rgbaArray, offset);
                }
            });
        });
        this.context.putImageData(this.processImageData, 0, 0);
    }

    blur (radio = 5) {
        this.traverse((rgba, point) => {
            const block = this.loader.getBlockByCenterPoint({point, radio});
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

    gaussBlur (radio = 5) {
        const gaussMap = gaussFunc(radio);
        this.traverse((rgba, point) => {
            const block = this.loader.getBlockByCenterPoint({point, radio, checkOutBorder: false});
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
}