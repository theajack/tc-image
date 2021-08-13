/*
 * @Author: tackchen
 * @Date: 2021-08-09 10:36:53
 * @LastEditors: tackchen
 * @FilePath: \tc-image\src\filter.ts
 * @Description: Coding something
 */

import {rgbToGray} from './transform';
import {IRGBA} from './types/type';

export function reverseRGBA (rgba: IRGBA) {
    rgba.r = 255 - rgba.r;
    rgba.g = 255 - rgba.g;
    rgba.b = 255 - rgba.b;
    return rgba;
}

export function grayRRBA (rgba: IRGBA) {
    const gray = rgbToGray(rgba);
    rgba.r = gray;
    rgba.g = gray;
    rgba.b = gray;
    return rgba;
}