angular.module('starter.controllers')

.controller('TournamentFeedCtrl', function($location, $scope, $http, authenticatedUserService, $state, $interval, $ionicGesture, serverCallService, $ionicPopup, $ionicListDelegate) {

    $scope.goToCardDetail = function(id) {
        $state.go('app.card', {
            id: id
        });
    };

    // Timer card related functions
    $scope.timerRunning = true;

    $scope.startTimer = function() {
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };

    $scope.stopTimer = function() {
        $scope.$broadcast('timer-stop');
        $scope.timerRunning = false;
    };

    $scope.$on('timer-stopped', function(event, data) {
        console.log('Timer Stopped - data = ', data);
    });

    $scope.destroyCard = function(index) {
        $scope.cards.splice(index, 1);
    };

    var getCardData = function() {
        var params = {};
        serverCallService.makeGet(AppSettings.baseApiUrl + "rest/card", params, success, error);
    };

    var getTimerCardData = function() {
        var params = {};
        serverCallService.makeGet(AppSettings.baseApiUrl + "rest/timercard", params, timercardSuccess, error);
    };

    $scope.doRefresh = function() {
        getTimerCardData();
        getCardData();
    };

    function success(data) {
        $scope.cards = data;
    }

    function error() {
        // An alert dialog
        var alertPopup = $ionicPopup.alert({
            title: 'Polling failed',
            template: 'Error with polling.'
        });
        alertPopup.then(function() {

        });
    }

    function timercardSuccess(data) {
        $scope.timercards = data;
        // takes the first element from array(should be only one timercard at once for one person)
        $scope.endDate = data[0].endDate;

        var currentDate = new Date();
        var endDate = new Date(data[0].endDate);
        //checks if there is less than 15 minutes between current time and timercard end time
        if (endDate - currentDate <= 900000) {
            $scope.time = "time-alert";
        }
    }

    getTimerCardData();
    getCardData();
    $interval(getCardData, 90000);
    $interval(getTimerCardData, 90000);
});