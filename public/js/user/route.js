/**** Initial app ****/
var app = angular.module("typeWriterApp", ["ngRoute"]);

/**** Routing ****/
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "routing/intro",
        access: {restricted: true}
    })
    .when("/login", {
        templateUrl : "routing/login",
        controller: 'loginController',
        access: {restricted: false}
    })
    .when("/signup", {
        templateUrl : "routing/signup",
        controller: 'loginController',
        access: {restricted: false}
    })
    .when("/play", {
        templateUrl : "routing/play"
    })  
    .otherwise({
        template : "<h1>Wrong</h1><p>path</p>"
    });
    
    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});