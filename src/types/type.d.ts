/*
 * @Author: theajack
 * @Date: 2021-08-04 00:17:03
 * @LastEditor: theajack
 * @LastEditTime: 2021-09-03 00:29:48
 * @Description: Coding something
 * @FilePath: /tc-image/src/types/type.d.ts
 */
// xy平面上的点
export interface IPoint {
    x: number;
    y: number;
}
// 平面上的点
export interface I2DPoint {
    h: number;
    v: number;
}
export interface I3DPoint extends IPoint{
    z: number;
}
export interface I3DDeg extends I3DPoint{
}

export interface IBlock {
    start: IPoint;
    end: IPoint;
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
    image: HTMLImageElement;
}

export interface IOnLoaded {
    (options: IOnLoadedData): void;
}

export interface IJson<T = any> {
    [prop: string]: T;
}

export interface ISize {
    width: number;
    height: number;
}
export interface IOptionSize {
    width?: number;
    height?: number;
}