/*
 * @Author: tackchen
 * @Date: 2021-08-04 11:54:20
 * @LastEditors: tackchen
 * @FilePath: /tc-image/src/util.ts
 * @Description: Coding something
 */
import {IPoint, IRGBA, IOnLoadedData, IRGB, IBlock} from '../types/type';
import {imageUrlToImage, imageToCanvas, canvasToImageData} from './transform';

export function pointToIndex (point: IPoint, imageWidth: number) {
    const order = (point.y - 1) * imageWidth + (point.x - 1);
    return order * 4;
}

export function indexToPoint (index: number, imageWidth: number): IPoint {
    const order = Math.floor(index / 4);
    return {
        x: order % imageWidth + 1, // 横坐标
        y: Math.floor(order / imageWidth) + 1 // 纵坐标
    };
}

export function getRgbaByIndex (index: number, imageData: ImageData): IRGBA {
    return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3]
    };
}

export function alpha255ToAlpha01 (alpha255: number) {
    return Math.round(alpha255 / 255 * 100) / 100; // alpha 值
}

export function getRgbaByPoint (point: IPoint, imageWidth: number, imageData: ImageData) {
    return getRgbaByIndex(pointToIndex(point, imageWidth), imageData);
}

export function countAverageRgba (rgbArr: IRGB[]): IRGBA {
    const rgbaTotal = countRGBATotal(rgbArr as IRGBA[]);
    const count = rgbArr.length;
    const rgba = countAverageRgbWithRgbTotal(rgbaTotal, count) as IRGBA;
    rgba.a = Math.floor(rgbaTotal.a / count);
    return rgba;

}

export function countAverageRgb (rgbaArr: IRGBA[]) {
    const rgbaTotal = countRGBATotal(rgbaArr);
    return countAverageRgbWithRgbTotal(rgbaTotal, rgbaArr.length);
}

function countRGBATotal (rgbaArr: IRGBA[]): IRGBA {
    const rgbTotal: IRGBA = {r: 0, g: 0, b: 0, a: 0};
    rgbaArr.forEach(rgba => {
        rgbTotal.r += rgba.r;
        rgbTotal.g += rgba.g;
        rgbTotal.b += rgba.b;
        if (typeof rgba.a === 'number')
            rgbTotal.a += rgba.a;
    });
    return rgbTotal;
}

function countAverageRgbWithRgbTotal (rgbTotal: IRGB, count: number): IRGB {
    return {
        r: Math.floor(rgbTotal.r / count),
        g: Math.floor(rgbTotal.g / count),
        b: Math.floor(rgbTotal.b / count),
    };
}

// 获取16进制颜色
export function rgbaToHEX ({r, g, b, a}: IRGBA) {
    const rgb = rgbToHEX({r, g, b});
    let strA = (typeof a === 'number' && a !== 1) ? (Math.round(a * 255)).toString(16) : '';
    if (strA.length === 1) strA = '0' + strA;
    return rgb + strA;
}

export function rgbToHEX ({r, g, b}: IRGB) {
    let strR = r.toString(16);
    let strG = g.toString(16);
    let strB = b.toString(16);
    if (strR.length === 1) strR = '0' + strR;
    if (strG.length === 1) strG = '0' + strG;
    if (strB.length === 1) strB = '0' + strB;
    return '#' + strR + strG + strB;
}

export async function loadImage (
    image: string | HTMLImageElement,
    imageElement?: HTMLImageElement
): Promise<IOnLoadedData> {
    if (typeof image === 'string') {
        image = await imageUrlToImage(image, imageElement);
    }
    const canvas = imageToCanvas(image);
    const imageData = canvasToImageData(canvas);

    return {
        imageData,
        imageWidth: image.width,
        imageHeight: image.height,
        // canvas,
        // canvasContext: (canvas.getContext('2d') as CanvasRenderingContext2D),
        image
    };
}

export function rgbaToStyleString (rgba: IRGBA) {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha255ToAlpha01(rgba.a)})`;
}

export function randomColorRgb ():IRGB {
    return {
        r: randomColorValue(),
        g: randomColorValue(),
        b: randomColorValue(),
    };
}

export function randomColorValue () {
    return Math.round(Math.random() * 255);
}

export function rgbaToColorArray (rgba: IRGBA) {
    return [
        rgba.r,
        rgba.g,
        rgba.b,
        rgba.a,
    ];
}
export function rgbToColorArray (rgb: IRGB) {
    const rgba = rgb as IRGBA;
    rgba.a = 255;
    return rgbaToColorArray(rgba);
}

export function traverseBlock ({
    block, callback, size = 1
}: {
    block: IBlock
    callback: (point: IPoint, index: number)=>void,
    size?: number;
}) {
    const {start, end} = block;
    let index = 0;
    for (let y = start.y; y <= end.y; y += size) {
        for (let x = start.x; x <= end.x; x += size) {
            callback({x, y}, index);
            index++;
        }
    }
}


// 服务于高斯模糊算法 提取与中心点的x差的数组
export function extractBlockXArray (block: IBlock): number[] {
    const center = extractBlockCenterPoint(block);
    const xArray: number[] = [];
    traverseBlock({
        block,
        callback (point) {
            xArray.push(point.x - center.x);
        }
    });
    return xArray;
}

export function extractBlockCenterPoint (block: IBlock): IPoint {
    return {
        x: (block.end.x - block.start.x) / 2 + 1,
        y: (block.end.y - block.start.y) / 2 + 1
    };
}

export function countScaleMap (size: number, targetSize: number): Array<Array<number>> {
    const avg = size / targetSize;
    const result: Array<Array<number>> = [];
    let nextResult = 0, currentValue;
    const smallToBig = (size <= targetSize);
    for (let i = 0; i < targetSize; i++) {
        currentValue = nextResult + 1;
        nextResult = Math.round((i + 1) * avg);
        // if (nextResult < 1) nextResult = 1;
        // if (nextResult < currentValue) {nextResult = currentValue;}
        result.push([
            smallToBig ? nextResult : currentValue,
            nextResult
        ]);
    }
    return result;
}