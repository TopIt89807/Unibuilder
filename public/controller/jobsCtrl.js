app.controller("jobs", function($scope) {
  $scope.jobstatus = [
          {model : "Open", value : "Open"},
          {model : "Closed", value : "Closed"}
      ];
  $scope.jobtype = [
          {model : "-- Please Select --", value : "none"},
          {model : "New Home", value : "new"},
          {model : "Remodel", value : "remodel"},
          {model : "Specialty(Other)", value : "other"}
      ];
  $scope.jobgroups = [];
  $scope.records = ["27 shadow cantyyon, investor",
     "Al Qarrous, Mohammed",
     "Anderson, CHarmagne",
     "Bamhart, Bob"];
  $scope.c_jobstatus= $scope.jobstatus[0].value;
  $scope.c_jobtype= $scope.jobtype[0].value;
  $scope.c_notify=false;
  $scope.c_workdays = [false, false, false, false, false, false, false];

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
//    $scope.c_jobcolor = $scope.colors[0].value;

  $scope.workdays = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
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
    $("#jobcolorselect").css("background-color", $scope.c_jobcolor);
  }
  $scope.onCreateJob = function() {

    var jobname = $scope.c_jobname != undefined? $scope.c_jobname : null;
    var jobstatus = $scope.c_jobstatus;
    var jobtype = $scope.c_jobtype;
    var projectmgr = $scope.c_projmgr != undefined? $scope.c_projmgr : null;
    var notify = $scope.c_notify;
    var jobgroup = $scope.c_jobgroup != undefined? $scope.c_jobgroup : null;
    var jprefix = $scope.c_jprefix != undefined? $scope.c_jprefix : null;
    var address = $scope.c_address != undefined? $scope.c_address : null;
    var lotinfo = $scope.c_lotinfo != undefined? $scope.c_lotinfo : null;
    var city = $scope.c_city != undefined? $scope.c_city : null;
    var state = $scope.c_state != undefined? $scope.c_state : null;
    var zip = $scope.c_zip != undefined? $scope.c_zip : null;
    var permit = $scope.c_permit != undefined? $scope.c_permit : null;
    var price = $scope.c_price != undefined? $scope.c_price : null;

    var projstart = $scope.c_projstart != undefined? $scope.c_projstart : null;
    var actstart = $scope.c_actstart != undefined? $scope.c_actstart : null;
    var projcompletion = $scope.c_projcompletion != undefined? $scope.c_projcompletion : null;
    var actcompletion = $scope.c_actcompletion != undefined? $scope.c_actcompletion : null;
    var workdays = $scope.c_workdays;
    var jobcolor = $scope.c_jobcolor!= undefined? $scope.c_jobcolor : null;;

    var internal = $scope.c_internal != undefined? $scope.c_internal : null;
    var sub = $scope.c_sub != undefined? $scope.c_sub : null;

    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var firstname = snapshot.val().firstname;
      var lastname = snapshot.val().lastname;
      var email = snapshot.val().email;
      var type = snapshot.val().type;
      var access;
      if(type == "admin") {
        access = "cevd"
      }else if(type == "internal") {
        access = "c---"
      }
      // [START_EXCLUDE]
      return writeNewJob(firebase.auth().currentUser.uid,
          firstname, lastname, email,
          jobname, jobstatus, jobtype, projectmgr, notify, $scope.jobgroups, jobgroup, jprefix,
          address, lotinfo, city, state, zip, permit, price,
          projstart, actstart, projcompletion, actcompletion, workdays, jobcolor,
          internal, sub, access);
      // [END_EXCLUDE]
    });
  }

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    ComponentsBootstrapMultiselect.init();
    ComponentsBootstrapMultiselect.fff();
    ComponentsDateTimePickers.init();
  });
});
