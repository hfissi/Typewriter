/**** Initial Controller ****/
angular.module('typeWriterApp').controller('startApp', 
    function($scope, $http, $rootScope, $interval, $timeout) {
    
    /*** initial variables ***/
    $scope.score = 100;
    $scope.round = 0;
    $scope.time = 0;
    
    /*** change background color ***/
    $scope.changeColor = function (color) {
        $('body').css('background', '#000 radial-gradient(1000px 500px, '+color+', #000)');
        $('.nav.open').css('background', '#000 radial-gradient(1000px 500px, '+color+', #000)');
    }
    
    /** Get current user ***/
    $http.get('/CurrentUser')
    .then(function (response) {
        $scope.user = response.data.user;
    }, function (response) {
        console.log('error');
    })

    /** Get Scrore ***/
    $http.get('/score')
    .then(function (response) {
        $scope.scores = response.data.sort(function(a, b){ return b.score - a.score });
    }, function (response) {
        console.log('error');
    })
    
    /*** Menu ***/
    $('.navbar-toggle.white').on('click',function(){
        $('.nav').toggleClass('open');
    });

    /*** Chat ***/
    $timeout(function () {
        var socket = io();
        $(function () {
            var socket = io();
            $('form').submit(function(){
              socket.emit('chat message', { 'message' : $('#m').val() , 'user' : $scope.user.username});
              $('#m').val('');
              return false;
            });
            socket.on('chat message', function(msg){
              $('#messages').prepend($('<li>').text(msg.user +' : '+ msg.message));
            });
            /*** update score when user connect ***/
            socket.on('user connect', function(){
                $http.get('/score').then(function (response) {
                        $scope.scores = response.data.sort(function(a, b){ return b.score - a.score });
                    }, function (response) {
                        console.log('error');
                })
            });
        });
    },1000);

    /*** countdown timer ***/
    $scope.time = '05' + ":" + '00';
    startTimer();
    
    function startTimer() {
        
        var presentTime = $scope.time;
        var timeArray = presentTime.split(/[:]+/);
        var m = timeArray[0];
        var s = checkSecond((timeArray[1] - 1));
        if(s==59){
            m=m-1
        }
        
        // if timeout
        if( m < 0 ){
            $http.post('/player/score',{score: $scope.score, user: $scope.user.username}).
                then(function (status) {
                    socket.emit('user connect');
                   console.log(status.status)
                }, function (status) {
                   console.log(status.status)
            });
            $scope.finish = true;
            $scope.round = $scope.round + 1;
        }else{
            $scope.time = m + ":" + s;
            $timeout(startTimer, 1000);
        }
    }
    // checkSecond
    function checkSecond(sec) {
      if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
      if (sec < 0) {sec = "59"};
      return sec;
    }
    
    /*** get paragraphs ***/
    $http.get("/list")
    .then(function(response) {
        
        $scope.Para = response.data;
        $scope.CurrentPara = $scope.Para.slice($scope.round , $scope.round + 1)[0].para;
        $scope.paraTitle = $scope.Para[$scope.round].title;

        
        // $scope.CurrentParaArray = $scope.CurrentPara.split('');
        $scope.CurrentWordArray = $scope.CurrentPara.split(' ');
        
        // convert paragraph array to object
        let CurrentParaArrayToObject = (arr)=> {
            var myOb = {};
            for (var i = 0; i < arr.length; i++) {
                myOb[i] = arr[i];                
            }
            return myOb;
        }
        // Init first word
        $scope.CurrentParaObj = CurrentParaArrayToObject($scope.CurrentWordArray[0].split(''));
        
        // Init counters
        $scope.i = 0;
        $scope.j = 0;
        $scope.animation = 'slideInUp';
        $timeout(function () {
            $scope.animation = '';
        }, 2000);
        
        // onkey up function
        angular.element(window).on('keyup',function(e){
            
            if (((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 96 && e.keyCode < 123) || e.keyCode == 8) && !$('input#m').is(':focus')) {
                
                if ($scope.CurrentWordArray[$scope.j].split('') !== undefined && $scope.i < $scope.CurrentWordArray[$scope.j].split('').length - 1) {
                    
                    if (e.key.toLowerCase() == $scope.CurrentWordArray[$scope.j].charAt($scope.i).toLowerCase()) {
                        
                        $scope.$apply(function () {
                           
                           $scope.indexedChar = $scope.i;
                        
                        });
                        $scope.i++;
                    } else {
                        
                        $('.circle').css('border' , '1px solid red');
                        $timeout(function () {
                            $('.circle').css('border' , '1px solid transparent');
                        },500)

                        $scope.$apply(function () {

                            if ($scope.score > 0) {
                                $scope.score = $scope.score - 5;
                            }else{
                                $http.post('/player/score',{score: $scope.score, user: $scope.user.username}).
                                    then(function (status) {
                                        socket.emit('user connect');
                                       console.log(status.status)
                                    }, function (status) {
                                       console.log(status.status)
                                });
                                $scope.finish = true;
                            }
                        
                        });
                        return false;            
                    }
                
                } else if ($scope.j < $scope.CurrentWordArray.length - 1) {
                    
                    $scope.animation = 'slideInUp';
                    $timeout(function () {
                        $scope.animation = '';
                    }, 2000);
                    $scope.j++;
                    $scope.i = 0;
                    $scope.indexedChar = -1
                    $scope.CurrentParaObj = CurrentParaArrayToObject($scope.CurrentWordArray[$scope.j].split(''));
                
                } else {
                    
                    $scope.round = $scope.round + 1;
                    $http.post('/player/score',{score: $scope.score, user: $scope.user.username}).
                        then(function (status) {
                            socket.emit('user connect');
                           console.log(status.status)
                        }, function (status) {
                           console.log(status.status)
                    });
                    $scope.finish = true;
                
                }
            }
        })
    }, function(response) {
        
        //Second function handles error
        $scope.Para = "Something went wrong";
    
    });
});