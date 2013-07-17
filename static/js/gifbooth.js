var picturesTaken = 0;
var previewIndex = 0;
var cycleTimeoutId;
var frameCount = 5;
$(function () {

    var streaming = false,
        video = document.querySelector('#video'),
        cover = document.querySelector('#cover'),
        canvas = document.querySelector('#canvas'),
        photo = document.querySelector('#photo'),
        width = 702,
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
        $photo.css('width', width / 4);
        $photo.css('height', height / 4);
        $photo.css('display', 'block');
        frameCount = parseInt($('#frame-count-slider').val());
        if (picturesTaken < frameCount) {
            setTimeout(takePicture, 1000);
        } else if (picturesTaken === frameCount) {
            $('#shutter-button').attr('disabled', true);
            $('#video').hide();
            $('#canvases').show();
            $('canvas').hide();
            $('#save-button').show().attr('disabled', false);
            $('#retry-button').show().attr('disabled', false);
            cyclePreview();
        }
    }

    $('#shutter-button').on('click', function (e) {
        $(this).attr('disabled', true);
        picturesTaken = 0;
        takePicture();
    });

    $('#save-button').on('click', uploadImages);

    $('#retry-button').on('click', function(e) {
        clearTimeout(cycleTimeoutId);
        initializeBooth();
    });

    $('#frame-count-slider').slider();


});

function cyclePreview() {
    //there should be four images in #canvases. cycle through them to mimic a gif
    var $canvases = $('canvas');
    $canvases.hide();
    $($canvases.get(previewIndex)).show();
    previewIndex++;
    if (previewIndex >= frameCount) {
        previewIndex = 0;
    }
    cycleTimeoutId = setTimeout(cyclePreview, 1000);
}

function initializeBooth() {
    picturesTaken = 0;
    $('#retry-button').hide();
    $('#save-button').hide();
    $('#canvases').empty();
    $('#photos').empty();
    $('#video').show();
    $('#shutter-button').attr('disabled', false);
}

function uploadImages() {
    clearTimeout(cycleTimeoutId);
    $('#save-button').attr('disabled', true);
    $('#retry-button').attr('disabled', true);

    //grab images
    var remainingUploads = frameCount;
    var timestamp = Date.now();

    $('canvas').each(function(i, image) {
        var data = {
            image: image.toDataURL('image/jpg', 1),
            timestamp: timestamp,
            index: i,
            frameCount: frameCount
        };
        var settings = {
            url: "/upload",
            type: "post",
            data: data,
            success: uploadComplete,
            error: uploadError
        };
        $.ajax(settings);
    });

    function uploadComplete(res) {
        $('#error-message').text(remainingUploads + ' uploads remaining.');
        remainingUploads--;
        if (remainingUploads <= 0) {
            $('#error-message').text('Upload complete.');
            if (res['gif_url']) {
                $('#error-message').append(' <a href="' + res['gif_url'] + '">View Image</a>');
            }
            // all the uploads worked. reinitialize
            initializeBooth();
        }
    }

    function uploadError(e) {
        remainingUploads--;
        // show error message and reinitialize
        $('#error-message').text(e.responseText || "Error uploading image.");
        if (remainingUploads <= 0) {
            initializeBooth();
        }
    }

}

