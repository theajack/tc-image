/*
 * @Author: tackchen
 * @Date: 2021-08-13 15:20:15
 * @LastEditors: tackchen
 * @FilePath: \tc-image\helper\watch-asm.js
 * @Description: Coding something
 */
const {exec} = require('./tool');

async function main () {
    console.log('Watching build asm.');
    await exec('node ./node_modules/onchange/dist/bin.js -i "src/wasm/lib/**/*" -- node ./helper/build-asm.js');
}

main();