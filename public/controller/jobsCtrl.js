app.controller("jobs", function($scope, $timeout) {

/**
* Job Info Tab Information
*/
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
    var jobcolor = $scope.c_jobcolor!= undefined? $scope.c_jobcolor : null;

    var internal = $scope.c_internal != undefined? $scope.c_internal : null;
    var sub = $scope.c_sub != undefined? $scope.c_sub : null;

    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var firstname = snapshot.val().firstname;
      var lastname = snapshot.val().lastname;
      var email = snapshot.val().email;
      var type = snapshot.val().type;
      var access;
      // Default Group Access
      if(type == "admin") {
        access = "cevd";
      }else if(type == "internal") {
        access = "c---";
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

/**
* Owner Tab Information
*/
  $scope.ownertype = [
          {model : "None", value : "none"},
          {model : "Create New Contact", value : "new"},
          {model : "Search Existing Contacts", value : "search"}
      ];
  $scope.c_ownertype= $scope.ownertype[1].value;
  $scope.owneraccess = [
          {model : "-- None --", value : "none"},
          {model : "Email Invite", value : "invite"},
          {model : "Configure Manually", value : "manual"}
      ];
  $scope.c_owneraccess= $scope.owneraccess[0].value;
  $scope.owneraccessmethod = [
          {model : "No Items", value : "none"},
          {model : "Past Days Only", value : "past"},
          {model : "1 Week Ahead", value : "oneweek"},
          {model : "2 Weeks Ahead", value : "twoweeks"},
          {model : "1 Month Ahead", value : "onemonth"},
          {model : "2 Months Ahead", value : "twomonths"},
          {model : "3 Months Ahead", value : "threemonths"},
          {model : "Full Calendar", value : "full"}
      ];
  $scope.c_owneraccessmethod = $scope.owneraccessmethod[7].value;

/**
*Internal Users Tab Information
*/
  $scope.internalusers = [
  ];

  var usersRef = firebase.database().ref('/users/');
  var aaa = [];
  usersRef.on('value', function(data) {
    var userkeys = [];
    for(var k in data.val()) {
      userkeys.push(k);
    }
    for(var i=0; i<userkeys.length; i++) {
      var ref =  firebase.database().ref('/users/' + userkeys[i]);
      ref.once('value').then(function(snapshot) {
        var email = snapshot.val().email;
        var firstname = snapshot.val().firstname;
        var lastname = snapshot.val().lastname;
        var access = snapshot.val().type;
        if(access == "internal") {
          var node = {
            name : firstname + " " + lastname,
            viewing: false,
            notification: false
          };
          $scope.internalusers.push(node);
        }
      });
    }
  });

  $scope.selChangedView = function($index) {
    $scope.internalusers[$index].notification = $scope.internalusers[$index].viewing;
  }

  $scope.selectAllInternalView = function() {
    for(var i=0; i<$scope.internalusers.length; i++) {
      $scope.internalusers[i].viewing = $scope.internal_checkView;
      $scope.selChangedView(i);
    }
  }
  $scope.selectAllInternalNotif = function() {
    for(var i=0; i<$scope.internalusers.length; i++) {
      if($scope.internalusers[i].viewing)
        $scope.internalusers[i].notification = $scope.internal_checkNotif;
    }
  }
  /**
  *Subs/Vendors Tab Information
  */
  $scope.subs = [
    {name : "Sub1", viewing: false},
    {name : "Sub2", viewing: false},
    {name : "Sub3", viewing: false}
  ];


  $scope.selectAllSubsView = function() {
    for(var i=0; i<$scope.subs.length; i++) {
      $scope.subs[i].viewing = $scope.subs_checkView;
    }
  }

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    ComponentsBootstrapMultiselect.init();
    ComponentsBootstrapMultiselect.fff();
    ComponentsDateTimePickers.init();
    FormWizard.init();
    Profile.init();
    ComponentsBootstrapSwitch.init();
  });
});
