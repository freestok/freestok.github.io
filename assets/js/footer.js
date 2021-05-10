$('img').click((event) => {
    if (!event.target.className === 'portfolio-cropper') {
        console.log(event.target.className)
        let url = event.target.currentSrc;
        window.open(url, 'imgWindow');
    }
})