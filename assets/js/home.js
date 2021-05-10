// global variables
let splide;
let images = getImages();
let imgLength = images.length;


document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
        $('#image-slider').show();
        setInterval(clickThrough, 4000)
    }
  });

document.addEventListener( 'DOMContentLoaded', () => {
    $('#image-slider').hide();
	splide = new Splide( '#image-slider', {
        'cover': true,
        'heightRatio': 0.3,
        'autoplay': true,
        'arrows': false
    });
    splide.mount();
    let shuffledImages = shuffleArray(images);
    for (let img of shuffledImages) {
        imgSrc = `<img src="/assets/img/${img}"></img>`;
        splide.add('<li class="splide__slide">' + imgSrc + '</li>');
    }
} );

function clickThrough() {
    if (splide.index === imgLength - 1) {
        splide.go('-' + imgLength-1);
    } else {
        splide.go('+1');
    }
};

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

function showimage() {
    $("body").css("background-image", "url('/assets/img/header.png')"); // Onclick of button the background image of body will be test here. Give the image path in url
}
