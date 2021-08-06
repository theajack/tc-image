/*
 * @Author: theajack
 * @Date: 2021-07-28 00:31:52
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-04 12:00:10
 * @Description: Coding something
 * @FilePath: \tc-image\src\image-loader.ts
 */
import {
    loadImage,
    rgbaToHEX,
    indexToPos,
    countAverageRGBA,
    getRgbaByPos,
} from './util';
import {IPos, IRGBA, IOnLoaded, IOnLoadedData} from './type.d';

export default class ImageLoader implements IOnLoadedData {
    imageData: ImageData;
    imageWidth: number;
    imageHeight: number;
    _loaded_list: Array<IOnLoaded>;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    image: HTMLImageElement;
    constructor ({
        src, onloaded
    }: {
        src: string;
        onloaded?: IOnLoaded
    }) {
        this._loaded_list = [];
        this.imageWidth = 0;
        this.imageHeight = 0;
        loadImage(src, ({
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

    getRgbaByPos (pos: IPos) {
        return getRgbaByPos(pos, this.imageWidth, this.imageData);
    }

    countAreaAverageRGBA (pos1: IPos, pos2: IPos) {
        const array = [];
        for (let x = pos1.x; x <= pos2.x; x++) {
            for (let y = pos1.y; y <= pos2.y; y++) {
                array.push(this.getRgbaByPos({x, y}));
            }
        }
        return countAverageRGBA(array);
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

