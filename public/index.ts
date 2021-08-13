import {Renderer} from '../src';
import {importWasm} from '../src/wasm/loader';
import '../src/utils/time-log';

const SRC = '/img2.jpeg';
// const loader = new ImageLoader({src: SRC});

declare global{
    interface Window{
        render: Renderer;
        gaussFunc: Function;
        [prop: string]: any;
    }
}

// window.loader = loader;
// loader.onloaded(() => {
//     const leftRgba = loader.countLeftBorderAverageRgba();
//     const rightRgba = loader.countRightBorderAverageRgba();
//     console.log(leftRgba, rightRgba);
//     drawToDocument();
// });

// main();

testAsmScript();

export async function testAsmScript () {
    const module = await importWasm();
    window.module = module;
}

export function main () {

    const render = new Renderer({
        image: SRC
    });

    render.onLoaded(() => {
        const width = '400px';

        const loader = render.loader;
        loader.image.style.width = width;
        document.body.appendChild(loader.image);
        
        render.canvas.style.width = width;

        document.body.appendChild(render.canvas);

    });
    window.render = render;
}