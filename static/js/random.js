$(function() {
    getGifList();
    //refresh page every three minutes to pull in new gifs
    setTimeout(location.reload, 60000 * 3);
});

function getGifList() {
    var gifs;
    $.get('/gifs', function(res) {
        gifs = res['urls'];
        cycleGif();

    });

    function cycleGif() {
        var url = getRandomGifUrl(gifs);
        console.log(url);
        var img = document.createElement('img');
        $(img).attr('src', url);

        $('#random-container').empty();
        $('#random-container').append(img);
        maximizeGif($(img));
        setTimeout(cycleGif, 15000);
    }
}

function getRandomGifUrl(gifUrls) {
    return gifUrls[Math.floor(Math.random()*gifUrls.length)];
}

function maximizeGif($img) {
    //assuming that the window is wider than it is tall.
    $img.height($(window).height());
}
