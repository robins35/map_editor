import UI from 'ui'

let successCount = 0;
let errorCount = 0;
let imgs = {};
let imgPaths = [];
let spriteImageData

let isDone = function() {
    return ((imgPaths.length + spriteImageData.length) == (successCount + errorCount));
}

let loadImagePaths = (downloadCallback) => {
  $.ajax({
    dataType: "json",
    method: "GET",
    url: '/load_images',
    error: (error) => {
      console.log(`ERROR: ${error}`)
    },
    success: (data) => {
      imgPaths = data.standalone_image_paths
      spriteImageData  = data.sprite_sheets
      loadImages(downloadCallback)
    }
  });
}

let loadImages = function(downloadCallback) {
    let progressBar = new UI.ProgressBar(Game.canvas, {
      width: "50%",
      height: 20,
      alignment: "center",
      verticalAlignment: "middle",
      total: imgPaths.length + Object.keys(spriteImageData).length,
      backgroundColor: "#ffffff",
      color: "#ffffff",
      borderWidth: 2
    })
    Game.uiElements.push(progressBar)

    if ((imgPaths.length + spriteImageData.length) == 0) downloadCallback();


    for (let imagePath of  imgPaths) {
      let image = initializeImage(progressBar, downloadCallback)
      loadImage(image, imagePath, false);
    }

    for(let spriteSheet of spriteImageData) {
      let image = initializeImage(progressBar, downloadCallback)
      loadImage(image, spriteSheet, true)
    }
}

let initializeImage = (progressBar, downloadCallback) => {
  let image = new Image()
  image.addEventListener("load", function() {
      successCount++;
      progressBar.progress++
      if (isDone()) downloadCallback();
  }, false);

  image.addEventListener("error", function() {
      errorCount++;
      console.log(`Error loading image ${this.src}`)
      if (isDone()) downloadCallback();
  }, false);

  return image
}

let loadImage = (image, imageInfo, isSprite) => {
  if(isSprite)
    loadSpriteSheet(image, imageInfo)
  else
    loadStandaloneImage(image, imageInfo)
}

let loadStandaloneImage = (image, src) => {
  let imagePath = src.split('/').slice(-2)
  let imageType = imagePath[0]
  let imageName = imagePath[1].split('.').slice(0, -1).join('.')

  if(imgs[imageType] === undefined)
    imgs[imageType] = {}

  imgs[imageType][imageName] = {
    img: image,
    isSprite: false,
    imageCount: 1,
  }
  image.src = src
}

let loadSpriteSheet = (image, spriteSheet) => {
  let imagePath = spriteSheet.image_path.split('/').slice(-3)
  let imageType = imagePath[0]
  let spriteCount = spriteSheet.image_names.length

  if(imgs[imageType] === undefined)
    imgs[imageType] = {}

  for(let i = 0; i < spriteCount; i++) {
    let imageName = spriteSheet.image_names[i]

    imgs[imageType][imageName] = {
      img: image,
      index: i,
      imageCount: spriteCount,
      isSprite: true
    }
  }
  image.src = `/images/${imagePath.join('/')}`
}

// let loadAudio = function(downloadCallback) {
//     if(imgPaths.length == 0) downloadCallback();
// }

let loadAssets = function(downloadCallback) {
  let modifiedCallback = () => {
    for(const [imageType, imageHash] of Object.entries(this.imgs)) {
      for(const imageObject of Object.values(imageHash)) {
        imageObject.width = Math.floor(imageObject.img.width / imageObject.imageCount)
        imageObject.height = imageObject.img.height
      }
    }

    downloadCallback()
  }

  loadImagePaths(modifiedCallback)
}

let getImage = function(image_type, image_name) {
    return imgs[image_type][image_name];
}

export { loadAssets, getImage, imgs }

// let getAudio = function(name) {
//     return snds[name];
// }
