$(function() {
    //get ALL the gifs!
    $.get('/gifs', function(res) {
        var urls = res['urls'];
        var $container = $('#stream-container');
        $container.empty();
        for (var url in urls) {
            var image = document.createElement('img');
            $(image).attr('src', urls[url]);
            $container.append(image);
        }
        if ($(window).width() > $(window).height()) {
            var imageHeight = $(window).height();
            $('#stream-container').find('img').height(imageHeight);
        } else {
            var imageWidth = $(window).width();
            $('#stream-container').find('img').width(imageWidth);
        }
    });

});