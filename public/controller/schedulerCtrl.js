app.controller("scheduler", function($scope, dataService) {
  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }

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
    // $scope.jobname = $scope.jobs[0].value;
    for(var i=0; i<keys.length; i++) {
      var ref =  firebase.database().ref('/joblist/' + keys[i]);
      ref.once('value').then(function(snapshot) {
        var jobID = snapshot.key;
        var creatorID = snapshot.val().creatorID;
        firebase.database().ref('/jobs/' + jobID + '/' + creatorID).once('value').then(function(snapshot) {

          var access = snapshot.val().scheaccess;
          if(access.charAt(1) == 'v') {

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
          }
          $scope.$apply();
        });
      });
    }

  });
  var scheduleData = [
  //  {"taskId":4,"ownerId":1,"title":"Bowling tournament","description":"","startTimezone":null,"start":"\/Date(1370811600000)\/","end":"\/Date(1370822400000)\/","endTimezone":null,"recurrenceRule":null,"recurrenceID":null,"recurrenceException":null,"isAllDay":false},
  //  {"taskId":5,"ownerId":2,"title":"Take the dog to the vet","description":"","startTimezone":null,"start":"\/Date(1370939400000)\/","end":"\/Date(1370943000000)\/","endTimezone":null,"recurrenceRule":null,"recurrenceID":null,"recurrenceException":null,"isAllDay":false},
  //  {"taskId":6,"ownerId":3,"title":"Call Charlie about the project","description":"","startTimezone":null,"start":"\/Date(1370950200000)\/","end":"\/Date(1370955600000)\/","endTimezone":null,"recurrenceRule":null,"recurrenceID":null,"recurrenceException":null,"isAllDay":false}
  ];

  //$scope.changeJob = function() {
  dataService.changeJob = function() {
    if($scope.jobname == "All") {
      var scheduler = $("#scheduler").data("kendoScheduler");
      scheduler.options.editable = false;
      scheduler.view(scheduler.viewName());


      var ref = firebase.database().ref('/schedule/');
      ref.on('value', function(data) {
        if($scope.jobname == "All") {
          scheduleData = [];
          var scheduler = $("#scheduler").data("kendoScheduler");
          scheduler.dataSource.data(scheduleData);

          var keys = [];
          for(var k in data.val()) {
            keys.push(k);
          }
          for(var i=0; i<keys.length; i++) {
            var ref =  firebase.database().ref('/schedule/' + keys[i]);
            ref.once('value', function(data) {

              var skeys = [];
              for(var k in data.val()) {
                skeys.push(k);
              }

              for(var j=0; j<skeys.length; j++) {
                console.log(keys[i]);
                var ref =  firebase.database().ref('/schedule/' + keys[i] + '/' + skeys[j]);
                ref.once('value').then(function(snapshot) {
                  var jsonobj = JSON.parse(JSON.stringify(snapshot.val()));
                  jsonobj.start = new Date(jsonobj.start);
                  jsonobj.end = new Date(jsonobj.end);
                  scheduleData.push(jsonobj);
                  scheduler.dataSource.data(scheduleData);
                });
              }

            });
          }
        }
      });

    } else {
      var scheduler = $("#scheduler").data("kendoScheduler");
      var userid = $scope.getCurrentUID();
      var jobid = $scope.jobname;
      var scheref = firebase.database().ref('/jobs/' + jobid + '/' + userid);
      scheref.once('value').then(function(snapshot) {
        var access = snapshot.val().scheaccess != undefined? snapshot.val().scheaccess : "----";
        var cc,vv,ee,dd;
        if(access.charAt(0) == 'c')
          cc = true;
        else if(access.charAt(0) == '-')
          cc = false;
        if(access.charAt(1) == 'v')
          vv = true;
        else if(access.charAt(1) == '-')
          vv = false;
        if(access.charAt(2) == 'e')
          ee = true;
        else if(access.charAt(2) == '-')
          ee = false;
        if(access.charAt(3) == 'd')
          dd = true;
        else if(access.charAt(3) == '-')
          dd = false;

        scheduler.options.editable = {
          create:cc,
          move:ee,
          resize:ee,
          update:ee,
          destroy:dd
        }
        scheduler.view(scheduler.viewName());
        if(vv) {
          var ref = firebase.database().ref('/schedule/' + $scope.jobname);
          ref.once('value', function(data) {
            scheduleData = [];
            var scheduler = $("#scheduler").data("kendoScheduler");
            scheduler.dataSource.data(scheduleData);

            var keys = [];
            for(var k in data.val()) {
              keys.push(k);
            }
            for(var i=0; i<keys.length; i++) {
              var ref =  firebase.database().ref('/schedule/' + $scope.jobname + '/' + keys[i]);
              ref.once('value').then(function(snapshot) {
                var jsonobj = JSON.parse(JSON.stringify(snapshot.val()));
                jsonobj.start = new Date(jsonobj.start);
                jsonobj.end = new Date(jsonobj.end);
                scheduleData.push(jsonobj);
                scheduler.dataSource.data(scheduleData);
              });
            }
          });
        } else {
          alert("You have no access for this job!");
          scheduleData = [];
          scheduler.dataSource.data(scheduleData);
          scheduler.options.editable = false;
          scheduler.view(scheduler.viewName());
        }

      });



    }
  }

  $("#scheduler").kendoScheduler({
      theme: "bootstrap",
      date: new Date(),
//      startTime: new Date("2013/6/13 07:00 AM"),
      height: 600,
      views: [
          "day",
          { type: "workWeek", selected: true },
          "week",
          "month",
          "agenda",
          { type: "timeline", eventHeight: 50}
      ],
      timezone: "Etc/UTC",
      messages: {
        editor: {
            allDayEvent: "Full day"
        }
      },
      editable:false,
      dataSource: {
          data:scheduleData,
          schema: {
              model: {
                  id: "taskId",
                  fields: {
                      taskId: { from: "taskId", type: "String" },
                      title: { from: "title", defaultValue: "No title", validation: { required: true } },
                      start: { type: "date", from: "start" },
                      end: { type: "date", from: "end" },
                      startTimezone: { from: "startTimezone" },
                      endTimezone: { from: "endTimezone" },
                      description: { from: "description"},
                      recurrenceId: { from: "recurrenceId" },
                      recurrenceRule: { from: "recurrenceRule" },
                      recurrenceException: { from: "recurrenceException" },
                      colorId: { from: "colorId", defaultValue: 1 },
                      isAllDay: { type: "boolean", from: "isAllDay" },
                      cloneid: { from: "cloneid",type: "String"},
                  }
              }
          }
      },
      resources: [
          {
              field: "colorId",
              title: "Color",
              dataSource: [
                  // { text: "Alex", value: 1, color: "#f8a398" },
                  // { text: "Bob", value: 2, color: "#51a0ed" },
                  // { text: "Charlie", value: 3, color: "#56ca85" }

                  { text: 'Maroon', value: '#442121', color: '#442121'},
                  { text: 'Merlot', value: '#572A2A', color: '#572A2A'},
                  { text: 'Tuscan Red', value: '#8C4343', color: '#8C4343'},
                  { text: 'Rose', value: '#AD5252', color: '#AD5252'},
                  { text: 'Victoria', value: '#C78888', color: '#C78888'},
                  { text: 'Brown', value: '#542C10', color: '#542C10'},
                  { text: 'Coffee', value: '#6C3815', color: '#6C3815'},
                  { text: 'Amber', value: '#AD5A21', color: '#AD5A21'},
                  { text: 'Peach', value: '#D67029', color: '#D67029'},
                  { text: 'Cream', value: '#E39D6C', color: '#E39D6C'},
                  { text: 'Forest', value: '#353F26', color: '#353F26'},
                  { text: 'Olive', value: '#435130', color: '#435130'},
                  { text: 'Green', value: '#6C824D', color: '#6C824D'},
                  { text: 'Mint', value: '#84A05E', color: '#84A05E'},
                  { text: 'Cucumber', value: '#ABBE91', color: '#ABBE91'},
                  { text: 'Plum', value: '#2D263E', color: '#2D263E'},
                  { text: 'Purple', value: '#3A3150', color: '#3A3150'},
                  { text: 'Lavender', value: '#5C4E81', color: '#5C4E81'},
                  { text: 'Iris', value: '#72609F', color: '#72609F'},
                  { text: 'Violet', value: '#9E92BD', color: '#9E92BD'},
                  { text: 'Navy', value: '#213444', color: '#213444'},
                  { text: 'Levi', value: '#2A4257', color: '#2A4257'},
                  { text: 'Ocean', value: '#436A8C', color: '#436A8C'},
                  { text: 'Ice', value: '#5283AD', color: '#5283AD'},
                  { text: 'Sky', value: '#88AAC7', color: '#88AAC7'},
                  { text: 'Graphite', value: '#323232', color: '#323232'},
                  { text: 'Gunmetal', value: '#404040', color: '#404040'},
                  { text: 'Silver', value: '#676767', color: '#676767'},
                  { text: 'Gray', value: '#7F7F7F', color: '#7F7F7F'},
                  { text: 'Full Moon', value: '#A7A7A7', color: '#A7A7A7'},
                  { text: 'Black', value: '#1D1D1D', color: '#1D1D1D'},
                  { text: 'Alarm Red', value: '#DD2222', color: '#DD2222'},
                  { text: 'Alarm Pink', value: '#ED2591', color: '#ED2591'},
                  { text: 'Alarm Blue', value: '#2222DD', color: '#2222DD'},
                  { text: 'Alarm Green', value: '#008000', color: '#008000'},
                  { text: 'Alarm Purple', value: '#6F116F', color: '#6F116F'},
                  { text: 'Alarm Orange', value: '#FF9600', color: '#FF9600'},
                  { text: 'Alarm Aqua', value: '#2CD1D2', color: '#2CD1D2'},
                  { text: 'Alarm Lime', value: '#9FC62A', color: '#9FC62A'},
                  { text: 'Alarm Gold', value: '#DDC817', color: '#DDC817'}
              ]
          },
          {
            field: "atendees",
            multiple: true,
            title: "Assigned To",
            dataSource: []
          }
      ]
  });
  var scheduler = $("#scheduler").data("kendoScheduler");


  var usersRef = firebase.database().ref('/users/');
  var assignee = [];

  usersRef.on('value', function(data) {
    var keys = [];
    for(var k in data.val()) {
      keys.push(k);
    }
    var raw = scheduler.resources[1].dataSource.data();
    var length = raw.length;
    for(var i=length-1; i>=0; i--){
      var item = raw[i];
      scheduler.resources[1].dataSource.remove(item);
    }

    assignee = [];
    var val = 0;
    for(var i=0; i<keys.length; i++) {
      var ref =  firebase.database().ref('/users/' + keys[i]);
      ref.once('value').then(function(snapshot) {
        var key = snapshot.key;
        var email = snapshot.val().email;
        var fname = snapshot.val().firstname;
        var lname = snapshot.val().lastname;
        var type;
        switch(snapshot.val().type) {
          case "admin":
            type = "Admin";
            break;
          case "owner":
            type = "Owner";
            break;
          case "internal":
            type = "Internal User";
            break;
          case "subs":
            type = "Subs/Vendors";
            break;
        }
        assignee.push({
          text: fname + " " + lname,
          value : val
        });
        scheduler.resources[1].dataSource.add({
          text: email,
          value : val
        });
        val++;
      });
    }
  });

  for(i=0; i<assignee.length; i++)
    scheduler.resources[1].dataSource.add(assignee[i]);

  scheduler.bind("save", scheduler_save);
  scheduler.bind("add", scheduler_add);
  scheduler.bind("moveEnd", scheduler_move);
  scheduler.bind("resizeEnd", scheduler_resize);
  scheduler.bind("edit", scheduler_edit);
  scheduler.bind("remove", scheduler_remove);

  var isAdding = false;
  var isEditing = false;
  function scheduler_add(e) {
    var scheduler = $("#scheduler").data("kendoScheduler");
    console.log(scheduler.dataSource.data());
    isAdding = true;
  }
  function scheduler_edit(e) {
    isEditing = true;
  }
  function scheduler_save(e) {
    var scheduler = $("#scheduler").data("kendoScheduler");
    if(isAdding) {
      //var scheduler = $("#scheduler").data("kendoScheduler");
      //scheduleData = scheduler.dataSource.data();

      var JobKey = $scope.jobname;
      //var newKey = firebase.database().ref().child('schedule').push().key;
      e.event.cloneid = e.event.uid;
      var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.event.uid);
      ref.update(JSON.parse(JSON.stringify(e.event)));
      isAdding = false;
    }
    if(isEditing) {
      var JobKey = $scope.jobname;
      var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.event.cloneid);
      var json = JSON.parse(JSON.stringify(e.event));
      console.log(json);
      ref.once('value').then(function(snapshot) {
        ref.update(json);
      });
      isEditing = false;
    }
  }
  function scheduler_move(e) {
    var JobKey = $scope.jobname;
    var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.event.cloneid);
    var json = JSON.parse(JSON.stringify(e.event));
    json.start = e.start;
    json.end = e.end;
    console.log(json);
    ref.once('value').then(function(snapshot) {
      ref.update(json);
    });
  }
  function scheduler_resize(e) {
    alert('');
    var JobKey = $scope.jobname;
    var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.event.cloneid);
    var json = JSON.parse(JSON.stringify(e.event));
    json.start = e.start;
    json.end = e.end;
    console.log(json);
    ref.once('value').then(function(snapshot) {
      ref.update(json);
    });
  }
  function scheduler_remove(e) {
    var JobKey = $scope.jobname;
    var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.event.cloneid);
    ref.once('value').then(function(snapshot) {
      ref.remove();
    });
  }



  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
//    TableDatatablesManaged.init();
//    ComponentsBootstrapSelect.init();
  });
});
