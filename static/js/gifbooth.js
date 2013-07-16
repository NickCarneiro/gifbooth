var picturesTaken = 0;
var previewIndex = 0;
var cycleTimeoutId;
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
        if (picturesTaken < 4) {
            setTimeout(takePicture, 1000);
        } else if (picturesTaken === 4) {
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
        takePicture();
    });

    $('#save-button').on('click', uploadImages);

    $('#retry-button').on('click', function(e) {
        clearTimeout(cycleTimeoutId);
        initializeBooth();
    });


});

function cyclePreview() {
    //there should be four images in #canvases. cycle through them to mimic a gif
    var $canvases = $('canvas');
    $canvases.hide();
    $($canvases.get(previewIndex)).show();
    previewIndex++;
    if (previewIndex >= 4) {
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
    $('#save-button').attr('disabled', true);
    $('#retry-button').attr('disabled', true);

    //grab images
    var remainingUploads = 4;
    var timestamp = Date.now();
    $('canvas').each(function(i, image) {
        var data = {
            image: image.toDataURL('image/jpg', 1),
            timestamp: timestamp,
            index: i
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

    function uploadComplete() {
        $('#error-message').text(remainingUploads + ' uploads remaining.');
        remainingUploads--;
        if (remainingUploads <= 0) {
            $('#error-message').text('Upload complete.');
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

