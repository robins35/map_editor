import { UI } from './ui'

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
    url: '/load_images',
    error: (error) => {
      console.log(`ERROR: ${error}`)
    },
    success: (data) => {
      imgPaths = data
      loadImages(downloadCallback)
    }
  });
}

var loadImages = function(downloadCallback) {
    var progressBar = new UI.ProgressBar(imgPaths.length)
    Game.uiElements.push(progressBar)

    if (imgPaths.length == 0) downloadCallback();
    for (var i = 0; i < imgPaths.length; i++) {
        (function(src) {
            var image_type, image_name
            [image_type, image_name] = src.split('/').slice(-2)

            if(imgs[image_type] === undefined)
              imgs[image_type] = {}

            imgs[image_type][image_name] = new Image()

            imgs[image_type][image_name].addEventListener("load", function() {
                successCount++;
                progressBar.progress++
                if (isDone()) downloadCallback();
            }, false);

            imgs[image_type][image_name].addEventListener("error", function() {
                errorCount++;
                console.log(`Error loading image ${this.src}`)
                if (isDone()) downloadCallback();
            }, false);

            imgs[image_type][image_name].src = src;
        })(imgPaths[i]);
    }
}

// var loadAudio = function(downloadCallback) {
//     if(imgPaths.length == 0) downloadCallback();
// }

var loadAssets = function(downloadCallback) {
    loadImagePaths(downloadCallback)
}

var getImage = function(image_type, image_name) {
    return imgs[image_type][image_name];
}

export { loadAssets, getImage, imgs }

// var getAudio = function(name) {
//     return snds[name];
// }
