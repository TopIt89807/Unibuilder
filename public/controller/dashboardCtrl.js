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
    for(var i=0; i<keys.length; i++) {
      var ref = firebase.database().ref('/joblist/' + keys[i]);
      ref.once('value').then(function(snapshot) {
        var jobID = snapshot.key;
        var creatorID = snapshot.val().creatorID;
        firebase.database().ref('/jobs/' + jobID + '/' + creatorID).once('value').then(function(snapshot) {
          var access = snapshot.val().access;
          if(access.charAt(2) == 'v') {
            jobcnt ++;
            $scope.d_jobcount = jobcnt;
            $scope.$apply();
          }
        });
      });
    }

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



            var jobaccess = "";
            if(access.charAt(0) == 'c') jobaccess += "Create ";
            if(access.charAt(1) == 'e') jobaccess += "Edit ";
            if(access.charAt(3) == 'd') jobaccess += "Delete ";

            var fileaccesses = "";
            if(fileaccess.charAt(0) == 'c') fileaccesses += "Create ";
            if(fileaccess.charAt(1) == 'u') fileaccesses += "Upload ";
            if(fileaccess.charAt(2) == 'v') fileaccesses += "Download ";
            if(fileaccess.charAt(3) == 'e') fileaccesses += "Edit ";
            if(fileaccess.charAt(4) == 'd') fileaccesses += "Delete ";

            var scheaccesses = "";
            if(scheaccess.charAt(0) == 'c') scheaccesses += "Create ";
            if(scheaccess.charAt(1) == 'v') scheaccesses += "View ";
            if(scheaccess.charAt(2) == 'e') scheaccesses += "Edit ";
            if(scheaccess.charAt(3) == 'd') scheaccesses += "Delete ";

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
