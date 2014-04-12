'use strict';

function download(canvas, filename) {

    /// create an "off-screen" anchor tag
    var lnk = document.createElement('a'),
        e;

    /// the key here is to set the download attribute of the a tag
    lnk.download = filename;

    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = canvas.toDataURL();

    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {

        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);

        lnk.dispatchEvent(e);

    } else if (lnk.fireEvent) {

        lnk.fireEvent("onclick");
    }
}

var app = angular.module('trianglePlayAppApp');

app.factory('ComputeTriange', function(){
  var TriangleShader = function(){
    this._processing = false;
  };

  TriangleShader.prototype.compute = function(options){
    if (this._processing){
      return new $.Deferred().reject();
    }

    var computeProcess = new $.Deferred();
    this._processing = true;
    setTimeout(function(){
      var palette = colorbrewer[options.palette];
      var palette2 = colorbrewer[options.palette_2];
      var t = new Trianglify({
        x_gradient: palette[9],
        y_gradient: palette2[9],
        bleed: parseInt(options.bleed, 10),
        cellpadding: parseInt(options.cellpadding, 10),
        noiseIntensity: parseFloat(options.noiseIntensity, 10),
        cellsize: parseInt(options.cellsize, 10)
      });
      this._processing = false;
      computeProcess.resolve(t.generate(options.width, options.height));
    }.bind(this),0);
    return computeProcess.promise();
  };

  TriangleShader.convertDataURLToImageData = function(dataURL, options, callback){
    if (dataURL !== undefined && dataURL !== null) {
      var canvas, context, image;
      canvas = document.createElement('canvas');
      canvas.width = options.width;
      canvas.height = options.height;
      context = canvas.getContext('2d');
      image = new Image();
      image.addEventListener('load', function(){
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        callback(canvas);
      }, false);
      image.src = dataURL;
    }
  };

  return TriangleShader;
});



app.controller('MainCtrl', function ($scope, ComputeTriange) {
  $scope.colorOptions = Object.keys(colorbrewer);
  $scope.trianglify = {
    cellsize: 70,
    bleed: 100,
    cellpadding: 1,
    noiseIntensity: 0,
    palette: 'PuOr',
    palette_2: 'PuOr',
    width: 1280,
    height: 800
  };
  $scope.processing = false;
  var compute = new ComputeTriange();
  $scope.downloadCurrent = function(){
    ComputeTriange.convertDataURLToImageData(
      $scope.pattern.dataUri,
      $scope.trianglify,
      function(canvas){
        download(canvas, 'image.png');
      });
  };
  $scope.drawTrianglify = function(options){
    compute.compute(options).then(function(pattern){
      $scope.pattern = pattern;
      var svgPreview = document.getElementById('svgPreview');
      svgPreview.setAttribute('style', 'width: 100%; height: ' + 360 +'px; ' + 'background-image: '+pattern.dataUrl + ';background-repeat: no-repeat; background-size: 100%; background-position:center center;');
    });
  };
  $scope.drawTrianglify($scope.trianglify);
});
