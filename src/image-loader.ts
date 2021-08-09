/*
 * @Author: theajack
 * @Date: 2021-07-28 00:31:52
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-08 13:42:50
 * @Description: Coding something
 * @FilePath: /tc-image/src/image-loader.ts
 */
import {
    loadImage,
    rgbaToHEX,
    indexToPos,
    countAverageRGBA,
    getRGBAByPos,
} from './util';
import {IPos, IRGBA, IOnLoaded, IOnLoadedData} from './type.d';

export class ImageLoader implements IOnLoadedData {
    imageData: ImageData;
    imageWidth: number;
    imageHeight: number;
    _loaded_list: Array<IOnLoaded>;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    image: HTMLImageElement;
    constructor ({
        image, onloaded
    }: {
        image: string | HTMLImageElement;
        onloaded?: IOnLoaded
    }) {
        this._loaded_list = [];
        this.imageWidth = 0;
        this.imageHeight = 0;
        loadImage(image).then(({
            imageData, imageWidth, imageHeight, canvas, canvasContext, image
        }: IOnLoadedData) => {
            this.imageData = imageData;
            this.imageWidth = imageWidth;
            this.imageHeight = imageHeight;
            this.canvas = canvas;
            this.canvasContext = canvasContext;
            this.image = image;
            if (typeof onloaded === 'function') {
                onloaded(this);
            }
            this._loaded_list.forEach(fn => {
                fn(this);
            });
            this._loaded_list = [];
        });
    }

    onloaded (fn: IOnLoaded) {
        if (this.imageData) {
            fn(this);
        } else {
            this._loaded_list.push(fn);
        }
    }

    rgbaToHEX (rgba: IRGBA) {
        return rgbaToHEX(rgba);
    }

    indexToPos (index: number) {
        return indexToPos(index, this.imageWidth);
    }

    countAverageRGBA (rgbaArray: Array<IRGBA>) {
        return countAverageRGBA(rgbaArray);
    }

    getRGBAByPos (pos: IPos) {
        return getRGBAByPos(pos, this.imageWidth, this.imageData);
    }

    countAreaAverageRGBA (start: IPos, end: IPos) {
        const array: IRGBA[] = [];
        this.traverseArea({
            start,
            end,
            callback: (pos) => {
                array.push(this.getRGBAByPos(pos));
            }
        });
        return countAverageRGBA(array);
    }

    traverseArea ({
        start, end, callback, size = 1
    }: {
        start: IPos,
        end: IPos,
        callback: (pos: IPos)=>void,
        size?: number;
    }) {
        for (let y = start.y; y <= end.y; y += size) {
            for (let x = start.x; x <= end.x; x += size) {
                callback({x, y});
            }
        }
    }

    countOffsetByPos (pos: IPos) {
        return (pos.x - 1) * 4 + (pos.y - 1) * 4 * this.imageWidth;
    }

    traverseImageByBlock (
        size: number,
        callback: (start: IPos, end: IPos)=>void
    ) {
        this.traverseArea({
            start: {x: 1, y: 1},
            end: {x: this.imageWidth, y: this.imageHeight},
            callback: (start) => {
                const end:IPos = {
                    x: start.x + size - 1,
                    y: start.y + size - 1
                };
                if (end.x >  this.imageWidth) {
                    end.x = this.imageWidth;
                }
                if (end.y >  this.imageHeight) {
                    end.y = this.imageHeight;
                }
                callback(start, end);
            },
            size
        });
    }

    traverseImage (callback: (pos: IPos)=>void) {
        this.traverseArea({
            start: {x: 1, y: 1},
            end: {x: this.imageWidth, y: this.imageHeight},
            callback
        });
    }

    countLeftBorderAverageRGBA () {
        return this.countAreaAverageRGBA({
            x: 1, y: 1
        }, {
            x: 1, y: this.imageHeight
        });
    }

    countRightBorderAverageRGBA () {
        return this.countAreaAverageRGBA({
            x: this.imageWidth, y: 1
        }, {
            x: this.imageWidth, y: this.imageHeight
        });
    }

    
};

