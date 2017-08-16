app.controller('mainCtrl', function($scope) {
    $scope.fff = 0;
    $scope.myFunc = function(num) {
      $scope.fff = num;
    }
});

app.config(function($routeProvider) {
  $routeProvider
    .when("/sample", {
      templateUrl : "sample.html"
    })
    .when("/jobs", {
      templateUrl : "jobs.html",
      controller : "jobs"
    });
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

app.controller("jobs", function($scope) {
  $scope.records = ["Aaa", "bbb", "Ccc", "Ddd"];
  $scope.jobgroups = [];
  $scope.jobstatus = [
          {model : "Open", value : "Open"},
          {model : "Closed", value : "Closed"}
      ];
  $scope.c_jobstatus= $scope.jobstatus[0].value;
  $scope.colors = [
    { name: 'Maroon', value: '#442121'},
    { name: 'Merlot', value: '#572A2A'},
    { name: 'Tuscan Red', value: '#8C4343'},
    { name: 'Rose', value: '#AD5252'},
    { name: 'Victoria', value: '#C78888'},
    { name: 'Brown', value: '#542C10'},
    { name: 'Coffee', value: '#6C3815'},
    { name: 'Amber', value: '#AD5A21'},
    { name: 'Peach', value: '#D67029'},
    { name: 'Cream', value: '#E39D6C'},
    { name: 'Forest', value: '#353F26'},
    { name: 'Olive', value: '#435130'},
    { name: 'Green', value: '#6C824D'},
    { name: 'Mint', value: '#84A05E'},
    { name: 'Cucumber', value: '#ABBE91'},
    { name: 'Plum', value: '#2D263E'},
    { name: 'Purple', value: '#3A3150'},
    { name: 'Lavender', value: '#5C4E81'},
    { name: 'Iris', value: '#72609F'},
    { name: 'Violet', value: '#9E92BD'},
    { name: 'Navy', value: '#213444'},
    { name: 'Levi', value: '#2A4257'},
    { name: 'Ocean', value: '#436A8C'},
    { name: 'Ice', value: '#5283AD'},
    { name: 'Sky', value: '#88AAC7'},
    { name: 'Graphite', value: '#323232'},
    { name: 'Gunmetal', value: '#404040'},
    { name: 'Silver', value: '#676767'},
    { name: 'Gray', value: '#7F7F7F'},
    { name: 'Full Moon', value: '#A7A7A7'},
    { name: 'Black', value: '#1D1D1D'},
    { name: 'Alarm Red', value: '#DD2222'},
    { name: 'Alarm Pink', value: '#ED2591'},
    { name: 'Alarm Blue', value: '#2222DD'},
    { name: 'Alarm Green', value: '#008000'},
    { name: 'Alarm Purple', value: '#6F116F'},
    { name: 'Alarm Orange', value: '#FF9600'},
    { name: 'Alarm Aqua', value: '#2CD1D2'},
    { name: 'Alarm Lime', value: '#9FC62A'},
    { name: 'Alarm Gold', value: '#DDC817'}
    ];


  $scope.onJobGroupAdd = function() {
    bootbox.prompt("Adding a job group. Enter title.", function(result) {
        if (result === null) {
            //alert("Prompt dismissed");
        } else {
            $scope.$apply(function() {
              $scope.jobgroups.push(result);
            });
        }
    });
  }

  $scope.changeColor = function() {
    $("#jobcolorselect").css("background-color", $scope.form);
  }

  $scope.onCreateJob = function() {

    var jobname = $scope.c_jobname;
    var jobstatus = $scope.c_jobstatus;
    var userId = firebase.auth().currentUser.uid;
    /*return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var firstname = snapshot.val().firstname;
      var lastname = snapshot.val().lastname;
      var email = snapshot.val().email;
      // [START_EXCLUDE]
      return writeNewJob(firebase.auth().currentUser.uid,
          firstname, lastname, email,
          $scope.c_jobname);
      // [END_EXCLUDE]
    });*/
  }

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    ComponentsBootstrapMultiselect.init();
    ComponentsBootstrapMultiselect.fff();
    ComponentsDateTimePickers.init();
  });
});
