import {ImageLoader} from './image-loader';
import {creatEventReady, IEventReady, IEventReadyListener} from './event';
import {createEmptyCanvas} from './transform';
import {IRGBA, IPos} from './type';
import {rgbaToColorArray, traverseBlock} from './util';
import {grayRRBA, reverseRGBA} from './filter';
import {gaussFunc} from './math';

/*
 * @Author: tackchen
 * @Date: 2021-08-08 09:50:51
 * @LastEditors: tackchen
 * @LastEditTime: 2021-08-12 16:36:05
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

    private traverse (callback: (rgba: IRGBA, pos: IPos)=>number[]) {
        let offset = 0;
        this.loader.traverseImage((pos) => {
            const rgba = this.loader.getRGBAByPos(pos);
            const array = callback(rgba, pos);
            this.processImageData.data.set(array, offset);
            offset += array.length;
        });

        this.context.putImageData(this.processImageData, 0, 0);
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
            const rgba = this.loader.countBlockAverageRGBA(block);
            const rgbaArray = rgbaToColorArray(rgba);
            traverseBlock({
                block,
                callback: (pos) => {
                    const offset = this.loader.countOffsetByPos(pos);
                    this.processImageData.data.set(rgbaArray, offset);
                }
            });
        });
        this.context.putImageData(this.processImageData, 0, 0);
    }

    blur (radio = 5) {
        this.traverse((rgba, pos) => {
            const block = this.loader.getBlockByCenterPos({pos, radio});
            const aveRgba = this.loader.countBlockAverageRGBA(block);
            return rgbaToColorArray(aveRgba);
        });
    }

    gaussBlur (radio = 5) {
        const gaussMap = gaussFunc(radio);
        this.traverse((rgba, pos) => {
            const block = this.loader.getBlockByCenterPos({pos, radio, checkOutBorder: false});
            const rgbaSum: IRGBA = {r: 0, g: 0, b: 0, a: 0};
            traverseBlock({
                block,
                callback: (pos, index) => {
                    const rgba = this.loader.getRGBAByPos(pos, true);
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
    // replaceColor ({
    //     target, replacement, range = 10
    // }: {
    //     target: IRGB,
    //     replacement: IRGB,
    //     range?: number
    // }) {
    //     this.traverse((rgba, pos) => {
    //         const throsold = 60;
    //         if (
    //             Math.abs(rgba.r - 251) <= throsold &&
    //             Math.abs(rgba.g - 249) <= throsold &&
    //             Math.abs(rgba.b - 252) <= throsold &&
    //             pos.y < this.height * 0.3
    //         ) {
    //             const rgb = randomColorRgb();
    //             return [rgb.r, rgb.g, rgb.b, rgba.a];
    //         } else {
    //             return [rgba.r, rgba.g, rgba.b, rgba.a];
    //         }
    //     });
    // }
}