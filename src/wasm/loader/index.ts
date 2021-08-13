/*
 * @Author: tackchen
 * @Date: 2021-08-13 10:34:22
 * @LastEditors: tackchen
 * @FilePath: \tc-image\src\wasm\loader\index.ts
 * @Description: Coding something
 */
import loader from '@assemblyscript/loader'; // or require

export async function importWasm () {
    const {exports} = await loader.instantiate(
        // Binary to instantiate
        fetch('http://localhost:8080/wasm/optimized.wasm'), // or fs.readFileSync
        // or fs.promises.readFile
        // or just a buffer
        // Additional imports
        {}
    );

    return exports;
}
