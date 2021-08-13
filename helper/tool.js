const fs = require('fs');
const childProcess = require('child_process');

function read (file, cb) {
    fs.readFile(file, 'utf8', (err, code) => {
        if (err) throw err;
        cb(code);
    });
}

function write (file, txt, cb) {
    fs.writeFile(file, txt, 'utf8', (err) => {
        if (err) throw err;
        if (cb)cb();
    });
}

function pick ({data = {}, target, attrs}) {
    if (!attrs) {
        attrs = Object.keys(target);
    }
    attrs.forEach(name => {
        if (typeof target[name] !== 'undefined')
            data[name] = target[name];
    });
    return data;
}
async function exec (cmd) {
    return new Promise(resolve => {
        // console.log(cmd);
        childProcess.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                throw new Error('Exec cmd error', error);
            }
            resolve({
                success: true,
                stdout,
                stderr
            });
        });
    });
}
module.exports = {
    read,
    write,
    pick,
    exec,
};