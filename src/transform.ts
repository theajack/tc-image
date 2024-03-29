import {IRGB} from './type';

/*
 * @Author: tackchen
 * @Date: 2021-08-07 15:15:28
 * @LastEditors: tackchen
 * @LastEditTime: 2021-08-12 17:26:18
 * @FilePath: \tc-image\src\transform.ts
 * @Description: Coding something
 */

export function fileToImageBase64 (file: File | Blob): Promise<string> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (e.target && typeof e.target.result === 'string') {
                resolve(e.target.result);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });
}

export function imageUrlToImage (url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = function () {
            resolve(image);
        };
        image.src = url;
    });
}

export function imageBase64ToImage (imageBase64: string): Promise<HTMLImageElement> {
    return imageUrlToImage(imageBase64);
}

export function videoToCanvas (video: HTMLVideoElement) {
    const {canvas, context} = createEmptyCanvas(video.videoWidth, video.videoHeight);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);  // 图片大小和视频分辨率一致
    return canvas;
}

export function createEmptyCanvas (width: number, height: number) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    return {canvas, context};
}

export function videoToImageBase64 (video: HTMLVideoElement) {
    return canvasToImageBase64(videoToCanvas(video));
}

export function imageToImageBase64 (image: HTMLImageElement) {
    return canvasToImageBase64(imageToCanvas(image));
}

export function imageToCanvas (image: HTMLImageElement) {
    const {canvas, context} = createEmptyCanvas(image.width, image.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
}

export function imageToImageData (image: HTMLImageElement) {
    return canvasToImageData(imageToCanvas(image));
}

export function canvasToImageData (canvas: HTMLCanvasElement): ImageData {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

export function canvasToImageBase64 (canvas: HTMLCanvasElement) {
    return canvas.toDataURL('image/jpg');
}

// https://www.cnblogs.com/zhangjiansheng/p/6925722.html
export function rgbToGray (rgb:IRGB) {
    return (rgb.r * 38 + rgb.g * 75 + rgb.b * 15) >> 7;
}

export function imageBase64ToBlobUrl (base64: string, sliceSize = 512): string {
    const byteCharacters = atob(base64.split(',')[1]);
    const contentType = base64.split(',')[0].split(':')[1].split(';')[0];

    const byteArrays = [];
      
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
      
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
      
        const byteArray = new window.Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});

    const blobUrl = URL.createObjectURL(blob);
      
    return blobUrl;
}