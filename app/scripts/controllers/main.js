'use strict';

angular.module('trianglePlayAppApp')
  .controller('MainCtrl', function ($scope) {
    $scope.colorOptions = Object.keys(colorbrewer);
    $scope.trianglify = {
      cellsize: 150,
      bleed: 100,
      cellpadding: 1,
      noiseIntensity: 0,
      palette: 'PuOr'
    };
    $scope.drawTrianglify = function(options){
      var width = 600;
      var height = 400;
      var palette = colorbrewer[options.palette];
      var t = new Trianglify({
        x_gradient: palette[9],
        bleed: parseInt(options.bleed, 10),
        cellpadding: parseInt(options.cellpadding, 10),
        noiseIntensity: parseFloat(options.noiseIntensity, 10),
        cellsize: parseInt(options.cellsize, 10)
      });
      var pattern = t.generate(width, height);

        function convertDataURLToImageData(dataURL, callback) {
          if (dataURL !== undefined && dataURL !== null) {
            var canvas, context, image;
            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            context = canvas.getContext('2d');
            image = new Image();
            image.addEventListener('load', function(){
              context.drawImage(image, 0, 0, canvas.width, canvas.height);
              callback(canvas);
            }, false);
            image.src = dataURL;
          }
        }

      convertDataURLToImageData(
        pattern.dataUri,
        function(canvas){
          try {
            var image = canvas.toDataURL("image/png");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
            var previewImage = document.getElementById('preview');
            previewImage.src = image;
          } catch(e) {
            var svgPreview = document.getElementById('svgPreview');
            svgPreview.setAttribute('style', 'width: 100%; height: ' + height +'px; ' + 'background-image: '+pattern.dataUrl);
          }
        });
    };
    $scope.drawTrianglify($scope.trianglify);
  });
