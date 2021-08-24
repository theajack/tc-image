/*
 * @Author: tackchen
 * @Date: 2021-08-13 10:34:22
 * @LastEditors: tackchen
 * @FilePath: /tc-image/src/wasm/loader/index.ts
 * @Description: Coding something
 */
import loader from '@assemblyscript/loader'; // or require

let asmModule: any = null;

async function importWasm () {
    const {exports} = await loader.instantiate(
        // Binary to instantiate
        fetch('http://localhost:8080/wasm/optimized.wasm'), // or fs.readFileSync
        // or fs.promises.readFile
        // or just a buffer
        // Additional imports
        {}
    );

    asmModule = exports;

    asmLoader.module = asmModule;

    return exports;
}

function arrToAsmU8Arr (array: number[]): number[] {
    return asmModule.__newArray(asmModule.UInt8Array_ID, array);
}

function arrToAsmF32Arr (array: number[]): number[] {
    return asmModule.__newArray(asmModule.Float32Array_ID, array);
}

function asmU8ArrToU8Arr (address: number): Uint8Array {
    return asmModule.__getUint8Array(address);
}

function asmI32ArrToI32Arr (address: number): Int32Array {
    return asmModule.__getInt32Array(address);
}

export const asmLoader = {
    import: importWasm,
    module: asmModule,
    transform: {
        arrToAsmU8Arr,
        arrToAsmF32Arr,
        asmU8ArrToU8Arr,
        asmI32ArrToI32Arr,
    },

};

// asmLoader.transform.asmU8ArrToU8Arr(
//     asmLoader.module.gaussBlur(
//         asmLoader.transform.arrToAsmF32Arr([0.1, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]),
//         asmLoader.transform.arrToAsmU8Arr([
//             200, 200, 200, 200,
//             200, 200, 200, 200,
//             200, 200, 200, 200,
//             200, 200, 200, 200,
//             200, 200, 200, 200,
//             200, 200, 200, 200,
//             200, 200, 200, 200,
//             200, 200, 200, 200,
//             200, 200, 200, 200,
//         ]),
//         3,
//         3,
//         1
//     )
// );