app.controller('mainCtrl', function($scope, dataService) {
    if (firebase.auth().currentUser) {
      //firebase.auth().signOut();
    }else {
//      alert("AAA");
    }
    // alert(firebase.auth().currentUser);

    $scope.fff = 3;
    $scope.myFunc = function(num) {
      $scope.fff = num;
    }

    $scope.jobs = [];
    $scope.jobs.push({
      name:"All",
      value:"All"
    });

    var jobsRef = firebase.database().ref('/joblist/');
    jobsRef.on('value', function(data) {
      var keys = [];
      for(var k in data.val()) {
        keys.push(k);
      }
      $scope.gridData = [];
      $scope.jobs = [];
      $scope.jobs.push({
        name:"All",
        value:"All"
      });
      $scope.jobname = $scope.jobs[0].value;
      for(var i=0; i<keys.length; i++) {
        var ref =  firebase.database().ref('/joblist/' + keys[i]);
        ref.once('value').then(function(snapshot) {
          var jobID = snapshot.key;
          var creatorID = snapshot.val().creatorID;
          firebase.database().ref('/jobs/' + jobID + '/' + creatorID).once('value').then(function(snapshot) {

            var access = snapshot.val().access;
            if(access.charAt(2) == 'v') {

              editable = access.charAt(1) != 'e'? 0 : 1;
  /*          if(access.charAt(1) != 'e') {
                $("#large").find('*').attr("disabled", true);
              }else {
                $("#large").find('*').attr("disabled", false);
              }
  */
              $scope.jobs.push({
                name:snapshot.val().jobname,
                value:snapshot.ref.parent.key
              });
              $scope.$apply();
            }
          });
        });
      }

    });

    $scope.changeJob = function() {
      dataService.changeJob();
    }

});

app.config(function($routeProvider) {
  $routeProvider
    .when("/dashboard", {
      templateUrl : "dashboard.html",
      controller: "dashboard"
    })
    .when("/jobs", {
      templateUrl : "jobs.html",
      controller : "jobs"
    })
    .when("/joblist", {
      templateUrl : "joblist.html",
      controller : "joblist"
    })
    .when("/users", {
      templateUrl : "users.html",
      controller : "users"
    })
    .when("/documents", {
      templateUrl : "documents.html",
      controller : "documents"
    })
    .when("/scheduler", {
      templateUrl : "scheduler.html",
      controller : "scheduler"
    })
    .when("/gantt", {
      templateUrl : "gantt.html",
      controller : "gantt"
    })
    .otherwise({ redirectTo: '/documents' });
});

app.service('dataService', function() {
});


app.directive('onFinishRender', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      if(scope.$last === true) {
        $timeout(function() {
          scope.$emit(attr.onFinishRender);
        })
      }
    }
  }
});
