/*
 * @Author: theajack
 * @Date: 2021-08-04 00:17:03
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-04 00:26:02
 * @Description: Coding something
 * @FilePath: \tc-image\src\type.d.ts
 */

interface IPos {
    x: number;
    y: number;
}

interface IRGB {
    r: number;
    g: number;
    b: number;
}

interface IRGBA extends IRGB {
    a: number;
}

interface IOnLoadedData {
    imageData: ImageData;
    imageWidth: number;
    imageHeight: number;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    image: HTMLImageElement;
}

interface IOnLoaded {
    (options: IOnLoadedData): void;
}