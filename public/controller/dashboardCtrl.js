app.controller("dashboard", function($scope, dataService) {
  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }

  dataService.changeJob = function() {
    if($scope.jobname == undefined) {return;}
    if($scope.jobname == "All") {

    }else {
      var ref = firebase.database().ref('/joblist/' + $scope.jobname);
      ref.once('value').then(function(snapshot) {
        var creatorID = snapshot.val().creatorID;
        firebase.database().ref('/jobs/' + $scope.jobname + '/' + creatorID).once('value').then(function(snapshot) {

          // snapshot.val() : Job Data
          var access = snapshot.val().scheaccess;

          $scope.$apply();
        });
      });
    }
  }
  dataService.changeJob();
});
