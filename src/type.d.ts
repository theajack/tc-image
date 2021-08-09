/*
 * @Author: theajack
 * @Date: 2021-08-04 00:17:03
 * @LastEditor: theajack
 * @LastEditTime: 2021-08-09 12:04:12
 * @Description: Coding something
 * @FilePath: \tc-image\src\type.d.ts
 */

export interface IPos {
    x: number;
    y: number;
}

export interface IBlock {
    start: IPos;
    end: IPos;
}

export interface IRGB {
    r: number;
    g: number;
    b: number;
}

export interface IRGBA extends IRGB {
    a: number;
}

export interface IOnLoadedData {
    imageData: ImageData;
    imageWidth: number;
    imageHeight: number;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    image: HTMLImageElement;
}

export interface IOnLoaded {
    (options: IOnLoadedData): void;
}

export interface IJson<T = any> {
    [prop: string]: T;
}