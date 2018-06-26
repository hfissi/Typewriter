angular.module('typeWriterApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      return $http.get('/player/status')
      // handle success
      .then(function (data) {
        if(data.data.status){          
          user = true;
        } else {
          user = false;
        }
      },
      // handle error
      function (data) {
        user = false;
      }); 
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/player/login',
        {username: username, password: password})
        // handle success
        .then(function (data) {
          if(data.status === 200 && data.data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        },function (data) {
          console.log(data)
          user = false;
          deferred.reject();
        })
      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/player/logout')
        // handle success
        .then(function (data) {
          user = false;
          deferred.resolve();
        },function (data) {
          user = false;
          deferred.reject();
        })

      // return promise object
      return deferred.promise;

    }

    function register(username, email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/player/register',
        {username: username, email: email, password: password})
        // handle success
        .then(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        },function (data) {
          deferred.reject();
        })

      // return promise object
      return deferred.promise;

    }

}]);