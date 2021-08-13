/*
 * @Author: tackchen
 * @Date: 2021-08-13 15:25:31
 * @LastEditors: tackchen
 * @FilePath: \tc-image\helper\build-asm.js
 * @Description: Coding something
 */

const {exec} = require('./tool');

export default async function main () {
    console.log('Start building asm...');
    // await exec('echo 111111');
    await exec('node ./node_modules/assemblyscript/bin/asc src/wasm/lib/index.ts --target release');
    console.log('Finished !');
    console.log();
}

main();