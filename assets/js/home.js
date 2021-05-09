document.addEventListener( 'DOMContentLoaded', () => {
    let images = getImages();
    let shuffledImages = shuffleArray(images);

	const splide = new Splide( '#image-slider', {
        'cover': true,
        'heightRatio': 0.25
    } ).mount();

    for (let img of shuffledImages) {
        console.log(`/assets/img/${img}`);
        splide.add(`
            <li class="splide__slide">
                <img src="/assets/img/${img}">
            </li>
        `)
    }
} );

function shuffleArray(array) {
    // credit to https://stackoverflow.com/a/12646864
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getImages() {
    return [
        'backsliding/preview.png',
        'cemetery/pre-query.png',
        'compliance/preview.png',
        'demographics/heatmap.png',
        'geocoding-py/donors-accuracy.png',
        'iberia/physical.png',
        'mesopotamia/false-color.png',
        'mordor/mordor.png',
        'riot/preview.png',
        'run-loop/preview.png',
        'tanaka/kasei-earth.png',
        'tanaka/kasei-bw.png',
        'tanaka/imhof.png',
        'tanaka/oxia.png',
        'header.png'
    ];
}
