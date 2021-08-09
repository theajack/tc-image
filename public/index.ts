import {Renderer} from '../src';

const SRC = '/img.jpeg';
// const loader = new ImageLoader({src: SRC});

declare global{
    interface Window{
        render: Renderer;
    }
}

// window.loader = loader;
// loader.onloaded(() => {
//     const leftRgba = loader.countLeftBorderAverageRGBA();
//     const rightRgba = loader.countRightBorderAverageRGBA();
//     console.log(leftRgba, rightRgba);
//     drawToDocument();
// });

main();

function main () {

    const render = new Renderer({
        image: SRC
    });

    render.onLoaded(() => {
        const width = '500px';

        const loader = render.loader;
        loader.image.style.width = width;
        document.body.appendChild(loader.image);
        
        render.canvas.style.width = width;

        document.body.appendChild(render.canvas);

    });
    window.render = render;
}