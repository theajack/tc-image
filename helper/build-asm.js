/*
 * @Author: tackchen
 * @Date: 2021-08-13 15:25:31
 * @LastEditors: tackchen
 * @FilePath: /tc-image/helper/build-asm.js
 * @Description: Coding something
 */
const log = require('single-line-log').stdout;
const chalk = require('chalk');
const {exec} = require('./tool');

async function main () {
    log(chalk.blue('=====Start building asm...'));
    await exec('node ./node_modules/assemblyscript/bin/asc src/wasm/lib/index.ts --target release --exportRuntime');
    log(chalk.green('=====Building asm Finished !'));
}

main();