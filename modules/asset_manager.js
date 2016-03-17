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
    var progressBar = new UI.ProgressBar({
      width: "50%",
      height: 20,
      alignment: "center",
      verticalAlignment: "middle",
      total: imgPaths.length,
      backgroundColor: "#ffffff",
      color: "#ffffff",
      borderWidth: 2
    })
    Game.uiElements.push(progressBar)

    if (imgPaths.length == 0) downloadCallback();
    for (var i = 0; i < imgPaths.length; i++) {
        (function(src) {
            var image_type, image_name
            let imagePath = src.split('/').slice(-2)
            image_type = imagePath[0]
            image_name = imagePath[1].split('.').slice(0, -1).join('.')

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
