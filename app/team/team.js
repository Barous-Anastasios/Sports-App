'use strict';

angular.module('SportsApp.team', ['ngRoute'])
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.when('/team', {
    templateUrl: 'team/team.html',
    controller: 'TeamController'
  });
}])

.controller('TeamController', ['$scope', '$http', function($scope, $http) {
    // The team inserted by the user. 
    $scope.team = null;

    // Showing the first team that matches the user's input.
    $scope.showteam = null;

    // An array with all the found team's players.
    $scope.playerslist = [];

    // An array with all the players the user has liked.
    $scope.favorites = [];

    // Checking if there are any favorites.
    $scope.fav = false;

    // The message to display on like or delete.
    $scope.msg = null;

    // The url base for the api call.
    var urlbase = 'http://www.thesportsdb.com/api/v1/json/1/searchplayers.php?t=';

    // Stores the selected by the user player in a scope variable.
    $scope.player_info = function(player){
      $scope.current_player = player;
    }

    // Inserts the 'liked' player into the array of favorites.
    $scope.add_favorite = function(player){
      // Only add if there hasnt been added.
      var exists = false;
      $scope.favorites.map(function(val){
        if(val.id == player.id){
           exists = true;
        }
      });

      if(!exists){
         $scope.favorites.push(player);
      }
      
      $scope.fav = true;

      // Creates a message to display for only 3 seconds.
      $('.msg').css('display', 'inline-block');
      $scope.msg = 'Player added to favorites';
      setTimeout(function(){
         $scope.msg = null;
         $('.msg').css('display', 'none');
      }, 3000);
    }

    // Removes the player from the array of favorites.
    $scope.remove = function(player){
      $scope.favorites = $scope.favorites.filter(function(val,index){
         if(val.id != player.id){
           return player;
         }
      });

      // Creates a message to display for only 3 seconds.
      $('.msg').css('display', 'inline-block');
      $scope.msg = 'Player removed from favorites';
      setTimeout(function(){
        $scope.msg = null;
        $('.msg').css('display', 'none');
     }, 3000);

      // If favorites array is empty dont show Favorites title.
      if($scope.favorites.length == 0){
         $scope.fav = false;
      }
    }

    // Sorts the players by their signing money.
    $scope.sortBySigning = function(){
      var helpArray = $scope.playerslist;
      $scope.playerslist = [];
      helpArray.sort(signingCompare);
      $scope.playerslist = helpArray;
    }

    // Sorts the players by their wage money.
    $scope.sortByWage = function(){
      var helpArray = $scope.playerslist;
      $scope.playerslist = [];
      helpArray.sort(wageCompare);
      $scope.playerslist = helpArray;
    }

    // Whenever user changes their input another api call takes place fetching the data.
    $scope.change = function(){

      // When input changes the player that was selected has to be gone.
      $scope.current_player = null;
      $http({
        method:'GET',
        headers: {'Content-Type': 'application/json; charset=utf-8; Access-Control-Allow-Origin: *'},
        url: urlbase + $scope.team,
      }).then(function (response){
          // If a team is matched with user input value.
          if(response.data.player){

            // For each call we clear up the players list.
            $scope.playerslist = [];

            // Looping over the players array we get from the api call.
            response.data.player.map(function(val){

                // Creating an empty object for each player.
                var player = {};

                // Saving data.
                player['name'] = val.strPlayer;
                player['id'] = val.idPlayer;

                if(val.strThumb){
                  player['image'] = val.strThumb;
                } else {
                  player['image'] = 'public/img/no-image.png'
                } 

                if(val.strWage){
                  player['wage'] = val.strWage;
                } else {
                  player['wage'] = 'N/A';
                }

                if(val.strSigning){
                   player['signing'] = val.strSigning;
                } else {
                   player['signing'] = 'N/A'
                }

                if(val.strDescriptionEN){
                  player['description'] = val.strDescriptionEN;
                } else {
                  player['description'] = 'Not available';
                }
                
                // Getting the age of the player.
                var ageArray = val.dateBorn.split('');
                player['age'] = (new Date()).getFullYear() - parseInt(ageArray[0] + ageArray[1] + ageArray[2] + ageArray[3])
                
                // Pushing the player into the players array.
                $scope.playerslist.push(player);
            })

            // Saves the name of the team in a scope variable. 
            $scope.showteam = response.data.player[0].strTeam;

            // Initial sort in descending wage order.
            $scope.sortByWage();
          }
      }, function (response){
        $('.msg').css('display', 'inline-block');
        $scope.msg = 'Something went wrong';
      });
    }

    // Helpful sort by signing function.
    function signingCompare(a, b) {
      var stripped_a = a['signing'].replace(/\D/g,'');
      var stripped_b = b['signing'].replace(/\D/g,'');
      console.log('first:' + stripped_a + ', second:' + stripped_b)
      if (stripped_a > stripped_b)
        return -1;
      if (stripped_a < stripped_b)
        return 1;
      return 0;
    }

    // Helpful sort by wage function.
    function wageCompare(a, b) {
      var stripped_a = a['wage'].replace(/\D/g,'');
      var stripped_b = b['wage'].replace(/\D/g,'');
      if (stripped_a > stripped_b)
        return -1;
      if (stripped_a < stripped_b)
        return 1;
      return 0;
    }

}]);