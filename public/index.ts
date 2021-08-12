import {Renderer} from '../src';

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

main();

function main () {

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