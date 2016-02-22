var app = angular.module('CarsApp', []);

app.controller('CarsCtrl', function ($scope, API) {

  $scope.allCars = [];

  API.getCars()
    .then(function (data) {
      $scope.allCars = angular.copy(data.cars)
    });

  $scope.saveCar = function (car) {
    API.postCar(car)
      .then(function () {
        $scope.allCars.filter(function (el) {
          return el.id === car.id
        })[0].isChanged = false;
      })
  }

});

app.factory('API', function ($http, $q) {

  function getCars() {
    var deferred = $q.defer();

    var url = 'http://localhost:3000/cars';
    $http({method: 'GET', url: url})
      .then(function (data) {
        var cars = data.data;
        deferred.resolve({cars: cars});
      }, function (data) {

        deferred.resolve()
      });

    return deferred.promise;
  }

  function postCar(car) {
    var deferred = $q.defer();

    var url = 'http://localhost:3000/car?id={carId}&capacity={capacity}'
      .replace('{carId}', car.id)
      .replace('{capacity}', car.capacity);

    $http({method: 'POST', url: url})
      .then(function (data) {

        deferred.resolve();
      }, function (data) {

        deferred.resolve()
      });

    return deferred.promise;
  }

  return {
    getCars: getCars,
    postCar: postCar
  }
});