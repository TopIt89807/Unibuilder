app.controller("dashboard", function($scope, dataService) {
  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }

  var jobsRef = firebase.database().ref('/joblist/');
  jobsRef.on('value', function(data) {
    var keys = [];
    for(var k in data.val()) {
      keys.push(k);
    }
    $scope.d_jobcountall = keys.length;

    var jobcnt = 0;
    $scope.d_jobcount = jobcnt;
    for(var i=0; i<keys.length; i++) {
      var ref = firebase.database().ref('/joblist/' + keys[i]);
      ref.once('value').then(function(snapshot) {
        var creatorID = snapshot.val().creatorID;
        var jobID = snapshot.key;
        var deleted = snapshot.val().deleted != undefined? snapshot.val().deleted : false;
        if(!deleted) {
          firebase.database().ref('/jobs/' + jobID + '/' + $scope.getCurrentUID()).once('value').then(function(snapshot) {
            var jobaccess = snapshot.val().access;
            if(jobaccess.charAt(2) == 'v') {
              firebase.database().ref('/jobs/' + jobID + '/' + creatorID).once('value').then(function(snapshot) {
                  jobcnt ++;
                  $scope.d_jobcount = jobcnt;
                  $scope.$apply();
              });
            }
          });
        }
      });
    }

  });

  console.log($scope.getCurrentUID());

  var userRef = firebase.database().ref('/users/' + $scope.getCurrentUID());
  userRef.once('value').then(function(data) {
    var type = data.val().type;
    var typeStr = "";
    switch(type) {
      case "admin":
        typeStr = "Admin";
        break;
      case "owner":
        typeStr = "Owner";
        break;
      case "internal":
        typeStr = "Internal User";
        break;
      case "subs":
        typeStr = "Subs/Vendors";
        break;
    }
    $scope.d_usertype = typeStr;
  });

  dataService.changeJob = function() {
    if($scope.jobname == undefined) {return;}
    if($scope.jobname == "All") {
      $scope.d_jobname = "-";
      $scope.d_jobstatus = "-";
      $scope.d_lastupload = "-";


      $scope.d_jobaccess = "-";
      $scope.d_docaccess = "-";
      $scope.d_scheaccess = "-";
      // $scope.$apply();
      var map = new GMaps({
          div: '#dash_map'
      });

    }else {
      var ref = firebase.database().ref('/joblist/' + $scope.jobname);
      ref.once('value').then(function(snapshot) {
        var creatorID = snapshot.val().creatorID;
        firebase.database().ref('/jobs/' + snapshot.key + '/' + creatorID).once('value').then(function(snapshot) {
          // snapshot.val() : Job Data
          var access = snapshot.val().access;
          var fileaccess = snapshot.val().fileaccess;
          var scheaccess = snapshot.val().scheaccess;
          var lastid = snapshot.val().lastfileid;
          if(access.charAt(2) == 'v') {
            $scope.d_jobname = snapshot.val().jobname;
            $scope.d_jobstatus = snapshot.val().status;
            var ref = firebase.database().ref('/documents/' + $scope.jobname);
            ref.once('value' , function(data) {
              webix.ui({
                view:"filemanager",
                data: data.val(),
                container:"filemgrtmp",
                id:"fmanagertmp"
              });

              if(lastid != undefined) {
                var info = $$("fmanagertmp").getItem(lastid);
                var lastup = "";
                if(info.type != "folder") {
                  console.log(info);
                  var d = new Date(0);
                  d.setUTCSeconds(info.date);
                  lastup =  info.value + ",   " + Math.round(info.size / 1024, 2) + "KB,   " + d.toLocaleString();
                }
                $scope.d_lastupload = lastup;
              } else $scope.d_lastupload = "-";
              $scope.$apply();

            });

            $("#dash_map").css("width", "100%");
            $("#dash_map").css("height", "500px");
            if(snapshot.val().mapped == "mapped") {
              var map = new GMaps({
                  div: '#dash_map',
                  lat: snapshot.val().lat,
                  lng: snapshot.val().lng,
              });
              map.addMarker({
                  lat: snapshot.val().lat,
                  lng: snapshot.val().lng
              });
              map.setZoom(11);
            }else {
              var map = new GMaps({
                  div: '#dash_map'
              });
            }



            var jobaccess = "";
            if(access.charAt(0) == 'c') jobaccess += "Create ";
            if(access.charAt(1) == 'e') jobaccess += "Edit ";
            if(access.charAt(3) == 'd') jobaccess += "Delete ";

            var fileaccesses = "";
            if(fileaccess != undefined) {
              if(fileaccess.charAt(0) == 'c') fileaccesses += "Create ";
              if(fileaccess.charAt(1) == 'u') fileaccesses += "Upload ";
              if(fileaccess.charAt(2) == 'v') fileaccesses += "Download ";
              if(fileaccess.charAt(3) == 'e') fileaccesses += "Edit ";
              if(fileaccess.charAt(4) == 'd') fileaccesses += "Delete ";
            }else fileaccesses = "-";

            var scheaccesses = "";
            if(scheaccess != undefined) {
              if(scheaccess.charAt(0) == 'c') scheaccesses += "Create ";
              if(scheaccess.charAt(1) == 'v') scheaccesses += "View ";
              if(scheaccess.charAt(2) == 'e') scheaccesses += "Edit ";
              if(scheaccess.charAt(3) == 'd') scheaccesses += "Delete ";
            }else scheaccesses = "-";

            $scope.d_jobaccess = jobaccess;
            $scope.d_docaccess = fileaccesses;
            $scope.d_scheaccess = scheaccesses;
            $scope.$apply();
          }
        });
      });
    }
  }

  dataService.changeJob();
});
