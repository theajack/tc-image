import {ImageLoader} from './image-loader';
import {creatEventReady, IEventReady, IEventReadyListener} from './event';
import {createEmptyCanvas, rgbToGray} from './transform';
import {IRGBA, IPos, IRGB} from './type';

/*
 * @Author: tackchen
 * @Date: 2021-08-08 09:50:51
 * @LastEditors: tackchen
 * @LastEditTime: 2021-08-08 13:48:44
 * @FilePath: /tc-image/src/renderer.ts
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
            const gray = rgbToGray(rgba);
            return [gray, gray, gray, rgba.a];
        });
    }

    reverse () {
        this.traverse((rgba) => {
            return [255 - rgba.r, 255 - rgba.g, 255 - rgba.b, rgba.a]; // 反色
        });
    }

    blur (size = 20) {
        this.loader.traverseImageByBlock(size, (start, end) => {
            const rgba = this.loader.countAreaAverageRGBA(start, end);
            const rgbaArray = [rgba.r, rgba.g, rgba.b, rgba.a];
            this.loader.traverseArea({
                start,
                end,
                callback: (pos) => {
                    const offset = this.loader.countOffsetByPos(pos);
                    this.processImageData.data.set(rgbaArray, offset);
                }
            });
        });
        this.context.putImageData(this.processImageData, 0, 0);
    }
    replaceColor ({
        target, replacement, range = 10
    }: {
        target: IRGB,
        replacement: IRGB,
        range?: number
    }) {
        this.traverse((rgba, pos) => {
            const throsold = 60;
            if (
                Math.abs(rgba.r - 251) <= throsold &&
                Math.abs(rgba.g - 249) <= throsold &&
                Math.abs(rgba.b - 252) <= throsold &&
                pos.y < this.height * 0.3
            ) {
                const rgb = randomColorRgb();
                return [rgb.r, rgb.g, rgb.b, rgba.a];
            } else {
                return [rgba.r, rgba.g, rgba.b, rgba.a];
            }
        });
    }
}

function randomColorRgb ():IRGB {
    return {
        r: randomColorValue(),
        g: randomColorValue(),
        b: randomColorValue(),
    };
}

function randomColorValue () {
    return Math.round(Math.random() * 255);
}