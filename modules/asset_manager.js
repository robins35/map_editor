var successCount = 0;
var errorCount = 0;
var imgs = {};
var imgPaths = [];

var isDone = function() {
    return (imgPaths.length == (successCount + errorCount));
}

var loadImagePaths = (downloadCallback) => {
  $.ajax({
    dataType: "json",
    method: "GET",
    url: '/load_textures',
    error: (error) => {
      console.log(`ERROR: ${error}`)
    },
    success: (data) => {
      console.log(`Loaded image paths: ${data}`)
      imgPaths = data
      loadImages(downloadCallback)
    }
  });
}

var loadImages = function(downloadCallback) {
    if (imgPaths.length == 0) downloadCallback();
    for (var i = 0; i < imgPaths.length; i++) {
        (function(src) {
            var name = src.split('/').slice(-1)[0].split('.')[0];
            imgs[name] = new Image();

            imgs[name].addEventListener("load", function() {
                successCount++;
                console.log(`Loaded image ${this.src}`)
                if (isDone()) downloadCallback();
            }, false);

            imgs[name].addEventListener("error", function() {
                errorCount++;
                console.log(`Error loading image ${this.src}`)
                if (isDone()) downloadCallback();
            }, false);

            imgs[name].src = src;
        })(imgPaths[i]);
    }
}

// var loadAudio = function(downloadCallback) {
//     if(imgPaths.length == 0) downloadCallback();
// }

export var loadAssets = function(downloadCallback) {
    loadImagePaths(downloadCallback)
}

export var getImage = function(name) {
    return imgs[name];
}

export var imgs

// var getAudio = function(name) {
//     return snds[name];
// }

// module.exports = {
//     loadAssets : loadAssets,
//     getImage : getImage,
//     getAudio : getAudio,
//     imgs : imgs
// };
