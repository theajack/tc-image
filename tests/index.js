const assert = require('assert');

const fs = require('fs');
const loader = require('@assemblyscript/loader');
const path = require('path');
const imports = { /* imports go here */ };
// eslint-disable-next-line no-undef
const wasmModule = loader.instantiateSync(fs.readFileSync(path.resolve('public/wasm/optimized.wasm')), imports);

assert.strictEqual(wasmModule.exports.add(1, 2), 3);
console.log('ok');