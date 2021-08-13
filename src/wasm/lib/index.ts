// The entry file of your WebAssembly module.


export function add (a: i32, b: i32): i32 {
    return a + b;
}

// export const data: u8[] = [0, 0, 0, 0];

// export function traverseBlock (
//     imageData: u8[],
// ): void {
//     const length = imageData.length / 4;
//     for (let i = 0; i < length; i += 4) {
//         data[i] = 255 - imageData[i];
//         data[i + 1] = 255 - imageData[i + 1];
//         data[i + 2] = 255 - imageData[i + 2];
//         data[i + 3] = imageData[i + 3];
//         // result.push(255 - imageData[i]);
//         // result.push(255 - imageData[i + 1]);
//         // result.push(255 - imageData[i + 2]);
//         // result.push(imageData[i + 2]);
//     }
// }

export const data: i32[] = [ 0, 0, 0, 0 ];

export function setData1 (): void {
    data[1] = 2;
}

export function returnI32Arr (): i32[] {
    return [1, 2];
}
export function returnU8Arr (): u8[] {
    return [1, 2];
}
export function returnString (): string {
    return '1121222221';
}
// var a = module.returnString()
// var view = module.__getString(a)
// console.log(view);