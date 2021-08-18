// The entry file of your WebAssembly module.

export const UInt8Array_ID = idof<Uint8Array>();

function getRgbaByIndex (imageData: Uint8Array, index: number): u8[] {
    
}

function getPointByIndex (
    index: number,
    width: number,
): number[] {
    const pIndex = index / 4;
    return [Math.floor(pIndex / width), pIndex % width];
}

function getBlockByCenterIndex (
    index: number,
    width: number,
    radio: number
): number[] {
    const point = getPointByIndex(index, width);

    return [];
}

export function gaussBlur (
    map: number[],
    imageData: Uint8Array,
    width: number,
    height: number,
    radio: number
): u8[] {
    const newImageData: u8 = [];
    const size = imageData.length / 4;
    for (let i = 0; i < size; i += 4) {

        const point = getPointByIndex(i, width);

        const x = point[0];
        const y = point[1];
        
    }

}

// export function traverseBlock2 (imageData: Uint8Array): u8[] {
//     const data: u8[] = [];
//     for (let i = 0; i < imageData.length; i += 4) {
//         data.push(255 - imageData[i]);
//         data.push(255 - imageData[i + 1]);
//         data.push(255 - imageData[i + 2]);
//         data.push(imageData[i + 3]);
//     }
//     return data;
// }


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