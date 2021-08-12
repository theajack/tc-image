/*
 * @Author: theajack
 * @Date: 2021-07-28 00:31:52
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-12 16:22:09
 * @Description: Coding something
 * @FilePath: \tc-image\src\image-loader.ts
 */
import {
    loadImage,
    rgbaToHEX,
    indexToPos,
    countAverageRGBA,
    getRGBAByPos,
    traverseBlock,
} from './util';
import {IPos, IRGBA, IOnLoaded, IOnLoadedData, IBlock} from './type.d';

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

    getRGBAByPos (pos: IPos, shapePos = false) {
        if (shapePos) {
            this.shapePos(pos);
        }
        return getRGBAByPos(pos, this.imageWidth, this.imageData);
    }
    // 对pos进行处理 如果超过边界则取
    shapePos (pos: IPos) {
        if (pos.x <= 0) pos.x = -(pos.x - 1);
        if (pos.y <= 0) pos.y = -(pos.y - 1);
        if (pos.x > this.imageWidth) pos.x = this.imageWidth - (pos.x - this.imageWidth) + 1;
        if (pos.y > this.imageHeight) pos.y = this.imageHeight - (pos.y - this.imageHeight) + 1;
    }

    countBlockAverageRGBA (block: IBlock) {
        const array: IRGBA[] = [];
        traverseBlock({
            block,
            callback: (pos) => {
                array.push(this.getRGBAByPos(pos));
            }
        });
        return countAverageRGBA(array);
    }

    countOffsetByPos (pos: IPos) {
        return (pos.x - 1) * 4 + (pos.y - 1) * 4 * this.imageWidth;
    }

    traverseImageByBlock (
        size: number,
        callback: (block: IBlock)=>void
    ) {
        traverseBlock({
            block: {
                start: {x: 1, y: 1},
                end: {x: this.imageWidth, y: this.imageHeight},
            },
            callback: (start) => {
                callback({
                    start,
                    end: this.checkOutRightBottomBorder({
                        x: start.x + size - 1,
                        y: start.y + size - 1
                    })
                });
            },
            size
        });
    }

    checkOutRightBottomBorder (pos: IPos, checkOutBorder: boolean = true) {
        if (checkOutBorder) {
            if (pos.x > this.imageWidth) pos.x = this.imageWidth;
            if (pos.y > this.imageHeight) pos.y = this.imageHeight;
        }
        return pos;
    }

    checkOutLeftTopBorder (pos: IPos, checkOutBorder: boolean = true) {
        if (checkOutBorder) {
            if (pos.x < 1) pos.x = 1;
            if (pos.y < 1) pos.y = 1;
        }
        return pos;
    }

    getBlockByCenterPos ({
        pos, radio, checkOutBorder = true
    }: {
        pos: IPos, radio: number, checkOutBorder?: boolean
    }): IBlock {
        return {
            start: this.checkOutLeftTopBorder({
                x: pos.x - radio,
                y: pos.y - radio,
            }, checkOutBorder),
            end: this.checkOutRightBottomBorder({
                x: pos.x + radio,
                y: pos.y + radio,
            }, checkOutBorder)
        };
    }


    traverseImage (callback: (pos: IPos)=>void) {
        traverseBlock({
            block: {
                start: {x: 1, y: 1},
                end: {x: this.imageWidth, y: this.imageHeight},
            },
            callback
        });
    }

    countLeftBorderAverageRGBA () {
        return this.countBlockAverageRGBA({
            start: {x: 1, y: 1},
            end: {x: 1, y: this.imageHeight}
        });
    }

    countRightBorderAverageRGBA () {
        return this.countBlockAverageRGBA({
            start: {x: this.imageWidth, y: 1},
            end: {x: this.imageWidth, y: this.imageHeight}
        });
    }

    checkPosOutBorder (pos: IPos) {
        return (
            pos.x <= 0 ||
            pos.y <= 0 ||
            pos.x > this.imageWidth ||
            pos.y > this.imageHeight
        );
    }
};

