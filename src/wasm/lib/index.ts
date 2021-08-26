// The entry file of your WebAssembly module.
const RGBA_LENGTH: i8 = 4;
export const UInt8Array_ID = idof<Uint8Array>();

export const Float32Array_ID = idof<Float32Array>();

// export function testArray (u81: u8[], u82: u8[], num: u8): u8 {
//     u81[0] = 100;
//     u82[0] = num;
//     return u81[0] + u82[0];
// }
/*
asmLoader.transform.asmU8ArrToU8Arr(
    asmLoader.module.getRgbaByIndex(
        asmLoader.transform.arrToAsmU8Arr([1,2,3,4,5,6,7,8]),
        4
    )
)
[5,6,7,8]
 */

export function getRgbaByIndex (imageData: Uint8Array, index: i32): Uint8Array {
    // return imageData.length;
    const arr: Uint8Array = new Uint8Array(4);
    for (let i: i8 = 0; i < RGBA_LENGTH; i++) {
        arr[i] = imageData[index + i];
    }
    return arr;
}

/*
asmLoader.transform.asmI32ArrToI32Arr(
    asmLoader.module.indexToPoint(20, 3)
)
[2, 1]
 */
// x y 都是从零开始
export function indexToPoint (
    index: i32,
    width: i32,
): i32[] {
    const pIndex = index / 4;
    return [pIndex % width, Math.floor(pIndex / width) as i32, ];
}

/*
asmLoader.module.pointToIndex(2, 1, 3, 3) // = 20
asmLoader.module.pointToIndex(-2, -1, 3, 3) // = 20
asmLoader.module.pointToIndex(2, 4, 3, 3) // = 8
 */
export function pointToIndex (
    x: i32,
    y: i32,
    width: i32,
    height: i32,
): i32 {
    return getReplaceAxis(y, height) * width * 4 + getReplaceAxis(x, width) * 4;
}
/*
asmLoader.module.getReplaceAxis(4, 3) // = 20
 */
export function getReplaceAxis (n: i32, size: i32): i32 {
    if (n < 0) {return -n;}
    if (n >= size) {return 2 * size - n - 2;} // (size - 1) - (n - (size - 1))
    return n;
}
/**
 *
asmLoader.transform.asmI32ArrToI32Arr(
    asmLoader.module.getBlockByCenterIndex(16, 3, 3, 1)
)
[0, 4, 8, 12, 16, 20, 24, 28, 32]
 */
export function getBlockByCenterIndex (
    index: i32,
    width: i32,
    height: i32,
    radio: i32
): Int32Array {
    const point = indexToPoint(index, width);
    const size = (radio * 2 + 1) * (radio * 2 + 1);
    // eslint-disable-next-line no-undef
    const block: Int32Array = new Int32Array(size);
    // const block: i32[] = [];

    let offset = 0;
    for (let y = point[1] - radio; y <= point[1] + radio; y ++) {
        for (let x = point[0] - radio; x <= point[0] + radio; x ++) {
            block[offset] = pointToIndex(x, y, width, height);
            offset++;
            // block.push(pointToIndex(x, y, width, height));
        }
    }
    return block;
    // return block.slice(0, size);
}
 
export function gaussBlur (
    map: f32[],
    imageData: Uint8Array,
    width: i32,
    height: i32,
    radio: i32
): Uint8Array {
    const size = width * height; // 像素点个数
    const newImageData: Uint8Array = new Uint8Array(size * 4);
    for (let index = 0; index < size * 4; index += 4) { // 对像素遍历

        // const rgbaSum: f32[] = [1, 2, 3, 4];
        const rgbaSum: Float32Array = new Float32Array(RGBA_LENGTH);
        const block = getBlockByCenterIndex(index, width, height, radio);
        // rgbaSum[0] = block.length as f32;
        for (let i = 0; i < block.length; i++) {
            const bindex = block[i];
            const brgba = getRgbaByIndex(imageData, bindex);

            for (let j: i8 = 0; j < RGBA_LENGTH; j++) {
                rgbaSum[j] += brgba[j] * map[i];
            }
        }
 
        for (let j: i8 = 0; j < RGBA_LENGTH; j++) {
            if (rgbaSum[j] > 255) {
                rgbaSum[j] = 255;
            } else if (rgbaSum[j] < 0) {
                rgbaSum[j] = 0;
            }
            newImageData[index + j] = Math.round(rgbaSum[j]) as u8;
            // newImageData[index + j] = 111;
        }
    }
    return newImageData;
}

export function traverseBlock2 (imageData: Uint8Array): u8[] {
    const data: u8[] = [];
    for (let i = 0; i < imageData.length; i += 4) {
        data.push(255 - imageData[i]);
        data.push(255 - imageData[i + 1]);
        data.push(255 - imageData[i + 2]);
        data.push(imageData[i + 3]);
    }
    return data;
}


// export function traverseBlock (imageData: u8[]): Uint8Array {
    
//     // const length = 4 / 4;
//     // eslint-disable-next-line no-undef
//     const data: Uint8Array = new Uint8Array(4);
//     const i = 0;
//     // for (let i = 0; i < length; i += 4) {
//     // data.push(255 - imageData[i]);
//     // data.push(255 - imageData[i + 1]);
//     // data.push(255 - imageData[i + 2]);
//     // data.push(imageData[i + 3]);

//     data[i] = 255 - imageData[i];
//     // data[i + 1] = 255 - imageData[i + 1];
//     // data[i + 2] = 255 - imageData[i + 2];
//     // data[i + 3] = imageData[i + 3];

//     // imageData[i] = 255 - imageData[i];
//     // imageData[i + 1] = 255 - imageData[i + 1];
//     // imageData[i + 2] = 255 - imageData[i + 2];
//     // imageData[i + 3] = imageData[i + 3];
//     // }
//     return data;
// }

// export function testMath (): number {
//     // return Math.floor(3 / 2);
//     return 98 % 10;
// }

// export function testInArray (arr: number[]): number {
//     return arr.length;
// }

// export function testLength (): number {
//     // eslint-disable-next-line no-undef
//     const arr: u8[] = [1, 1, 3];
//     return arr.length;
// }
// export function test (): u8 {
//     return 4 / 4;
// }

// export function returnI32Arr (): i32[] {
//     return [1, 2];
// }
// export function returnU8Arr (): u8[] {
//     return [1, 2];
// }
// export function returnString (): string {
//     return '112121122211121';
// }
// var a = module.returnString()
// var view = module.__getString(a)
// console.log(view);