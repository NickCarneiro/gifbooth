var picturesTaken = 0;
var previewIndex = 0;
$(function () {

    var streaming = false,
        video = document.querySelector('#video'),
        cover = document.querySelector('#cover'),
        canvas = document.querySelector('#canvas'),
        photo = document.querySelector('#photo'),
        width = 700,
        height = 0;

    navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getMedia(
        {
            video: true,
            audio: false
        },
        function (stream) {
            if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;
            } else {
                var vendorURL = window.URL || window.webkitURL;
                video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
            }
            video.play();
        },
        function (err) {
            console.log("An error occured! " + err);
        }
    );

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    function takePicture() {
        picturesTaken++;
        var $canvasElement = $(document.createElement('canvas'));
        $('#canvases').append($canvasElement);
        //create a small canvas element and append it to #canvases
        $canvasElement.attr('height', height);
        $canvasElement.attr('width', width);
        $canvasElement.hide();
        $canvasElement[0].getContext('2d').drawImage(video, 0, 0, width, height);
        var data = $canvasElement[0].toDataURL('image/png');
        var $photo = $(document.createElement('img'));
        $photo.attr('src', data);

        $('#photos').append($photo);
        $('#photos').css('padding-bottom',  height  - picturesTaken  * height / 4 + 'px');
        $photo.css('width', width / 4);
        $photo.css('height', height / 4);
        $photo.css('display', 'block');

        if (picturesTaken === 4) {
            $('#shutter-button').attr('disabled', true);
            $('#video').hide();
            $('#canvases').show();
            $('canvas').hide();
            $('#save-button').show();
            $('#retry-button').show();
            cyclePreview();
        }
    }

    $('#shutter-button').on('click', function (e) {
        takePicture();
    });

    $('#save-button').on('click', uploadImages);

    $('#retry-button').on('click', function(e) {
        initializeBooth();
    });


});

function cyclePreview() {
    //there should be four images in #canvases. cycle through them to mimic a gif
    var $canvases = $('canvas');
    $canvases.hide()
    $($canvases.get(previewIndex)).show();
    previewIndex++;
    if (previewIndex >= 4) {
        previewIndex = 0;
    }
    setTimeout(cyclePreview, 1000);
}

function initializeBooth() {
    picturesTaken = 0;
    $('#retry-button').hide();
    $('#save-button').hide();
    $('#canvases').empty();
    $('#photos').empty();
}

function uploadImages() {
    //grab images
    var remainingUploads = 4;
    $('canvas').each(function(i, image) {
        var imageData = { image: image.toDataUrl('image/jpg', 1) };
        var settings = {
            url: "/upload",
            type: "post",
            data: imageData,
            success: uploadComplete,
            error: uploadError
        };
        console.log("sending image");
        $.ajax(settings);
    });

    function uploadComplete() {
        remainingUploads--;
        if (remainingUploads <= 0) {
            // all the uploads worked. reinitialize
            initializeBooth();
        }
    }

    function uploadError() {
        // show error message and reinitialize
    }

}

