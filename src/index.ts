import ImageLoader from './image-loader';

const SRC = 'http://5b0988e595225.cdn.sohucs.com/images/20190122/9903e7691c5b43869f01fdb621afb927.jpeg';
const loader = new ImageLoader({src: SRC});

declare global{
    interface Window{
        loader: ImageLoader;
    }
}

window.loader = loader;
loader.onloaded(() => {
    const leftRgba = loader.countLeftBorderAverageRGBA();
    const rightRgba = loader.countRightBorderAverageRGBA();
    console.log(leftRgba, rightRgba);
});