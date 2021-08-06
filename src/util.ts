/*
 * @Author: tackchen
 * @Date: 2021-08-04 11:54:20
 * @LastEditors: tackchen
 * @FilePath: \tc-image\src\util.ts
 * @Description: Coding something
 */
import {IPos, IRGBA, IOnloaded} from './type.d';

export function posToIndex (pos: IPos, imageWidth: number) {
    const order = (pos.y - 1) * imageWidth + (pos.x - 1);
    return order * 4;
}

export function indexToPos (index: number, imageWidth: number) {
    const order = Math.floor(index / 4);
    return {
        x: order % imageWidth + 1, // 横坐标
        y: Math.floor(order / imageWidth) + 1 // 纵坐标
    };
}

export function getRgbaByIndex (index: number, imageData: ImageData) {
    return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: Math.round(imageData.data[index + 3] / 255 * 100) / 100 // alpha 值
    };
}

export function getRgbaByPos (pos: IPos, imageWidth: number, imageData: ImageData) {
    return getRgbaByIndex(posToIndex(pos, imageWidth), imageData);
}

export function countAverageRGBA (rgbaArr: IRGBA[]) {
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
export function rgbaToHEX ({r, g, b, a}: IRGBA) {
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

export function loadImage (src: string, onloaded: IOnloaded) {
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

export function rgbaToStyleString (rgba: IRGBA) {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}