/*
 * @Author: tackchen
 * @Date: 2021-08-04 11:54:20
 * @LastEditors: tackchen
 * @FilePath: /tc-image/src/util.ts
 * @Description: Coding something
 */
import {IPos, IRGBA, IOnLoadedData, IRGB} from './type';
import {imageUrlToImage, imageToCanvas, canvasToImageData} from './transform';

export function posToIndex (pos: IPos, imageWidth: number) {
    const order = (pos.y - 1) * imageWidth + (pos.x - 1);
    return order * 4;
}

export function indexToPos (index: number, imageWidth: number): IPos {
    const order = Math.floor(index / 4);
    return {
        x: order % imageWidth + 1, // 横坐标
        y: Math.floor(order / imageWidth) + 1 // 纵坐标
    };
}

export function getRGBAByIndex (index: number, imageData: ImageData): IRGBA {
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

export function getRGBAByPos (pos: IPos, imageWidth: number, imageData: ImageData) {
    return getRGBAByIndex(posToIndex(pos, imageWidth), imageData);
}

export function countAverageRGBA (rgbArr: IRGB[]): IRGBA {
    const rgbaTotal = countRGBATotal(rgbArr as IRGBA[]);
    const count = rgbArr.length;
    const rgba = countAverageRGBWithRGBTotal(rgbaTotal, count) as IRGBA;
    rgba.a = Math.floor(rgbaTotal.a / count);
    return rgba;

}

export function countAverageRGB (rgbaArr: IRGBA[]) {
    const rgbaTotal = countRGBATotal(rgbaArr);
    return countAverageRGBWithRGBTotal(rgbaTotal, rgbaArr.length);
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

function countAverageRGBWithRGBTotal (rgbTotal: IRGB, count: number): IRGB {
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

export async function loadImage (image: string | HTMLImageElement): Promise<IOnLoadedData> {
    if (typeof image === 'string') {
        image = await imageUrlToImage(image);
    }
    const canvas = imageToCanvas(image);
    const imageData = canvasToImageData(canvas);

    return {
        imageData,
        imageWidth: image.width,
        imageHeight: image.height,
        canvas,
        canvasContext: (canvas.getContext('2d') as CanvasRenderingContext2D),
        image
    };
}

export function rgbaToStyleString (rgba: IRGBA) {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha255ToAlpha01(rgba.a)})`;
}