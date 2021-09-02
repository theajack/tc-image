import {Renderer} from '../src';
import {asmLoader} from '../src/wasm/loader';
import '../src/utils/time-log';

// const SRC = '/photo.jpg';
const SRC = '/img.jpeg';
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
main();

export async function testAsmScript () {
    await asmLoader.import();
    window.asmLoader = asmLoader;
}

export function main () {

    const render = new Renderer({
        image: SRC,
        oninited () {
            const width = '400px';
    
            const loader = render.loader;
            loader.image.style.width = width;
            document.body.appendChild(loader.image);
    
            // const img = document.createElement('img');
            // img.src = '/bg.jpg';
            // img.style.width = width;
            // document.body.appendChild(img);
            
            render.canvas.style.width = width;
    
            document.body.appendChild(render.canvas);
        }
    });

    window.render = render;
}