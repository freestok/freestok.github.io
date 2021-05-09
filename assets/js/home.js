document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
        $('#image-slider').show();
    }
  });

document.addEventListener( 'DOMContentLoaded', () => {

    $('#image-slider').hide();
	const splide = new Splide( '#image-slider', {
        'cover': true,
        'heightRatio': 0.25,
        'autoplay': true
    });
    splide.mount();
    let images = getImages();
    let shuffledImages = shuffleArray(images);
    for (let img of shuffledImages) {
        imgSrc = `<img src="/assets/img/${img}"></img>`;
        splide.add('<li class="splide__slide">' + imgSrc + '</li>');
    }

    
    // console.log(document.readyState);

    // console.log('show!')
    // $('#image-slider').show();
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
