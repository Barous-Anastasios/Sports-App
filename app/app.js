'use strict';

angular.module('SportsApp', [
  'ngRoute',
  'SportsApp.team',
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .otherwise({redirectTo: 'team'});
}]);
