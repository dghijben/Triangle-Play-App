'use strict';

angular.module('trianglePlayAppApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .otherwise({
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
  });

