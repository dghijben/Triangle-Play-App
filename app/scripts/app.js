'use strict';

angular.module('trianglePlayAppApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

var width = document.body.clientWidth/1.5;
var height = document.body.clientHeight/1.5;
var t = new Trianglify({
    x_gradient: colorbrewer.PuOr[9],
    bleed: 200,
    noiseIntensity: 0,
    cellsize: 90});
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
      var image = canvas.toDataURL("image/png");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
      console.log(image.length);
      var previewImage = document.getElementById('preview');
      previewImage.src = image;
    }
)
