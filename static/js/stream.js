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
    });
});