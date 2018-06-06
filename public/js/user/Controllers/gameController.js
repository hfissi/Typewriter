/**** Initial Controller ****/
app.controller('startApp', function($scope, $http, $rootScope, $interval) {
    $scope.score = 100;
    $scope.round = 0;
    $scope.time = 0;
    $interval(function () {
        $scope.time = $scope.time + 1;
    },1000);
    $http.get("/list")
    .then(function(response) {
        $scope.Para = response.data;
        $scope.CurrentPara = $scope.Para.slice($scope.round , $scope.round + 1)[0].para;
        $scope.CurrentParaArray = $scope.CurrentPara.split('');
        let CurrentParaArrayToObject = (arr)=>{
            var myOb = {};
            for (var i = 0; i < arr.length; i++) {
                myOb[i] = arr[i];
                
            }
            return myOb;
        }
        $scope.CurrentParaObj = CurrentParaArrayToObject($scope.CurrentParaArray);
        let i = 0;
        angular.element(window).on('keyup',function(e){            
            if (((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 96 && e.keyCode < 123) || e.keyCode == 8) && i < $scope.CurrentPara.length) {
                if (e.key == $scope.CurrentPara.charAt(i)) {
                    $scope.$apply(function () {
                       $scope.indexedChar = i;
                    });
                    i++;
                }else {
                    $scope.$apply(function () {
                        $scope.score = $scope.score - 0.25;
                    });
                    return false;
                }
            }
        })
    }, function(response) {
        //Second function handles error
        $scope.Para = "Something went wrong";
    });
});