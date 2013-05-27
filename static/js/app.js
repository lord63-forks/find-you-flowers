// Generated by CoffeeScript 1.3.3

/*
Declare the app. A global level module where you can create routes, models, etc.
[] is where you list any other modules for dependency injection.
*/


(function() {
  var app;

  app = angular.module('flowerApp', ['ui.bootstrap']);

  app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    return $interpolateProvider.endSymbol(']]');
  });

  app.config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    return $routeProvider.when('/', {
      controller: 'indexCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  });

  /*
  Controllers.
  Should contain only business logic.
  DOM manipulation—the presentation logic of an application—is well known for
  being hard to test. Putting any presentation logic into controllers
  significantly affects testability of the business logic
  */


  app.controller('indexCtrl', function($scope, $location, $http) {
    $scope.sort = '-__weight';
    $scope.query = $location.hash().replace('-', ' ');
    $scope.$watch('query', function(query) {
      return $location.hash(query.replace(' ', '-'));
    });
    $http.get('/all/').then(function(response) {
      return $scope.flowers = response['data']['results'];
    });
    return $http.get('/suggested/').then(function(response) {
      return $scope.suggested = response['data']['results'];
    });
  });

  app.filter('truncate', function() {
    return function(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      } else {
        return text;
      }
    };
  });

  app.filter('search', function() {
    return function(array, query, fields) {
      var each, key, results, score, weight, _i, _len;
      console.time("Search");
      if (array) {
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          each = array[_i];
          score = 0;
          for (key in fields) {
            weight = fields[key];
            if (each[key].toLowerCase().indexOf(query) > -1) {
              score += weight;
            }
          }
          each['__weight'] = score;
        }
        results = _.sortBy(_.filter(array, function(item) {
          return item['__weight'] > 0;
        }), function(item) {
          return -item['__weight'];
        });
      }
      console.timeEnd("Search");
      return results;
    };
  });

}).call(this);
