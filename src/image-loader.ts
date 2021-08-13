/*
 * @Author: theajack
 * @Date: 2021-07-28 00:31:52
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-12 17:56:12
 * @Description: Coding something
 * @FilePath: \tc-image\src\image-loader.ts
 */
import {
    loadImage,
    indexToPoint,
    countAverageRgba,
    getRgbaByPoint,
    traverseBlock,
} from './util';
import {IPoint, IRGBA, IOnLoaded, IOnLoadedData, IBlock} from './types/type';

/**
 * point 从 1,1 开始到 this.imageWidth,this.imageHeight 结束
 * index 从 0 开始
 */
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

    // index 转 point
    indexToPoint (index: number) {
        return indexToPoint(index, this.imageWidth);
    }

    // 通过坐标获取颜色值
    getRgbaByPoint (point: IPoint, shapePoint = false) {
        if (shapePoint)  this.shapePoint(point);
        return getRgbaByPoint(point, this.imageWidth, this.imageData);
    }

    // 对 point 进行处理 如果超过边界则取其相对于边界的对称点
    shapePoint (point: IPoint) {
        if (point.x <= 0) point.x = -(point.x - 1);
        if (point.y <= 0) point.y = -(point.y - 1);
        if (point.x > this.imageWidth) point.x = this.imageWidth - (point.x - this.imageWidth) + 1;
        if (point.y > this.imageHeight) point.y = this.imageHeight - (point.y - this.imageHeight) + 1;
    }

    countBlockAverageRgba (block: IBlock) {
        const array: IRGBA[] = [];
        traverseBlock({
            block,
            callback: (point) => {
                array.push(this.getRgbaByPoint(point));
            }
        });
        return countAverageRgba(array);
    }

    countOffsetByPoint (point: IPoint) {
        return (point.x - 1) * 4 + (point.y - 1) * 4 * this.imageWidth;
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

    checkOutRightBottomBorder (point: IPoint, checkOutBorder: boolean = true) {
        if (checkOutBorder) {
            if (point.x > this.imageWidth) point.x = this.imageWidth;
            if (point.y > this.imageHeight) point.y = this.imageHeight;
        }
        return point;
    }

    checkOutLeftTopBorder (point: IPoint, checkOutBorder: boolean = true) {
        if (checkOutBorder) {
            if (point.x < 1) point.x = 1;
            if (point.y < 1) point.y = 1;
        }
        return point;
    }

    getBlockByCenterPoint ({
        point, radio, checkOutBorder = true
    }: {
        point: IPoint, radio: number, checkOutBorder?: boolean
    }): IBlock {
        return {
            start: this.checkOutLeftTopBorder({
                x: point.x - radio,
                y: point.y - radio,
            }, checkOutBorder),
            end: this.checkOutRightBottomBorder({
                x: point.x + radio,
                y: point.y + radio,
            }, checkOutBorder)
        };
    }


    traverseImage (callback: (point: IPoint)=>void) {
        traverseBlock({
            block: {
                start: {x: 1, y: 1},
                end: {x: this.imageWidth, y: this.imageHeight},
            },
            callback
        });
    }

    countLeftBorderAverageRgba () {
        return this.countBlockAverageRgba({
            start: {x: 1, y: 1},
            end: {x: 1, y: this.imageHeight}
        });
    }

    countRightBorderAverageRgba () {
        return this.countBlockAverageRgba({
            start: {x: this.imageWidth, y: 1},
            end: {x: this.imageWidth, y: this.imageHeight}
        });
    }

    checkPointOutBorder (point: IPoint) {
        return (
            point.x <= 0 ||
            point.y <= 0 ||
            point.x > this.imageWidth ||
            point.y > this.imageHeight
        );
    }
};

