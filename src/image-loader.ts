/*
 * @Author: theajack
 * @Date: 2021-07-28 00:31:52
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-04 00:34:59
 * @Description: Coding something
 * @FilePath: \tc-image\src\image-loader.ts
 */
 
function posToIndex (pos: IPos, imageWidth: number) {
    const order = (pos.y - 1) * imageWidth + (pos.x - 1);
    return order * 4;
}

function indexToPos (index: number, imageWidth: number) {
    const order = Math.floor(index / 4);
    return {
        x: order % imageWidth + 1, // 横坐标
        y: Math.floor(order / imageWidth) + 1 // 纵坐标
    };
}

function getRgbaByIndex (index: number, imageData: ImageData) {
    return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: Math.round(imageData.data[index + 3] / 255 * 100) / 100 // alpha 值
    };
}

function getRgbaByPos (pos: IPos, imageWidth: number, imageData: ImageData) {
    return getRgbaByIndex(posToIndex(pos, imageWidth), imageData);
}

function countAverageRGBA (rgbaArr: IRGBA[]) {
    const rgbTotal = {r: 0, g: 0, b: 0, a: 0};
    rgbaArr.forEach(rgba => {
        rgbTotal.r += rgba.r;
        rgbTotal.g += rgba.g;
        rgbTotal.b += rgba.b;
        rgbTotal.a += rgba.a;
    });
    const count = rgbaArr.length;
    return {
        r: Math.floor(rgbTotal.r / count),
        g: Math.floor(rgbTotal.g / count),
        b: Math.floor(rgbTotal.b / count),
        a: Math.floor(rgbTotal.a / count),
    };
}

// 获取16进制颜色
function rgbaToHEX ({r, g, b, a}: IRGBA) {
    let strR = r.toString(16);
    let strG = g.toString(16);
    let strB = b.toString(16);
    let strA = (typeof a === 'number' && a !== 1) ? (Math.round(a * 255)).toString(16) : '';
    // 补0
    if (strR.length === 1) strR = '0' + strR;
    if (strG.length === 1) strG = '0' + strG;
    if (strB.length === 1) strB = '0' + strB;
    if (strA.length === 1) strA = '0' + strA;
    // var hex = r + g + b;
    // // 简化处理,如 FFEEDD 可以写为 FED
    // if (r.slice(0, 1) == r.slice(1, 1) && g.slice(0, 1) == g.slice(1, 1) && b.slice(0, 1) == b.slice(1, 1)) {
    //     hex = r.slice(0, 1) + g.slice(0, 1) + b.slice(0, 1);
    // }
    return '#' + strA + strG + strB + strA;
}

function initImageLoader ({src, onloaded}: {
    src: string;
    onloaded: IOnLoaded
}) {
    const image = new window.Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = src;
    image.onload = function () {
        const canvas = window.document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');
        if (canvasContext === null) {
            return;
        }
        const imageWidth = image.width;
        const imageHeight = image.height;
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        canvasContext.drawImage(image, 0, 0, imageWidth, imageHeight);
    
        // 读取图片像素信息
        const imageData = canvasContext.getImageData(0, 0, imageWidth, imageHeight);
        onloaded({imageData, imageWidth, imageHeight, canvas, canvasContext, image});
        // var arrbox = [],
        //     length = imageData.data.length;
    
        // 生成box-shadow
        // for (let i = 0; i < 100; i++) {
        //     if (i % 4 === 0) { // 每四个元素为一个像素数据 r,g,b,alpha
        //         const pos = getPXPos(imgWidth, i);
        //         const rgba = getRgba(imgHeight, i);
        //         console.log(pos, rgba);
        //     }
        // }
    };
}

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
        initImageLoader({
            src,
            onloaded: ({
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
            }
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

    rgbaToStyleString (rgba: IRGBA) {
        return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    }
};

