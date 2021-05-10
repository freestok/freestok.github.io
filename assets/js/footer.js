$('img').click((event) => {
    let url = event.target.currentSrc;
    window.open(url, 'imgWindow');
})