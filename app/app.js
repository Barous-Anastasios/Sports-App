'use strict';

angular.module('SportsApp', [
  'ngRoute',
  'SportsApp.team',
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  	.when('/',
	  	{
	  		controller:'TeamController',
	  		templateUrl: 'team/team.html'
	  	})
    .otherwise({redirectTo: 'team'});
}]);
