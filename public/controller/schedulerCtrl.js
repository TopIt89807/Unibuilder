app.controller("scheduler", function($scope, $timeout) {
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
  var scheduleData = [
  //  {"taskId":4,"ownerId":1,"title":"Bowling tournament","description":"","startTimezone":null,"start":"\/Date(1370811600000)\/","end":"\/Date(1370822400000)\/","endTimezone":null,"recurrenceRule":null,"recurrenceID":null,"recurrenceException":null,"isAllDay":false},
  //  {"taskId":5,"ownerId":2,"title":"Take the dog to the vet","description":"","startTimezone":null,"start":"\/Date(1370939400000)\/","end":"\/Date(1370943000000)\/","endTimezone":null,"recurrenceRule":null,"recurrenceID":null,"recurrenceException":null,"isAllDay":false},
  //  {"taskId":6,"ownerId":3,"title":"Call Charlie about the project","description":"","startTimezone":null,"start":"\/Date(1370950200000)\/","end":"\/Date(1370955600000)\/","endTimezone":null,"recurrenceRule":null,"recurrenceID":null,"recurrenceException":null,"isAllDay":false}
  ];


  $scope.changeJob = function() {
    var ref = firebase.database().ref('/schedule/' + $scope.jobname);
    ref.on('value', function(data) {
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
  }

  $("#scheduler").kendoScheduler({
      date: new Date("2013/6/13"),
      startTime: new Date("2013/6/13 07:00 AM"),
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
                      ownerId: { from: "ownerId", defaultValue: 1 },
                      isAllDay: { type: "boolean", from: "isAllDay" },
                      cloneid: { from: "cloneid",type: "String"},
                  }
              }
          }
      },
      resources: [
          {
              field: "ownerId",
              title: "Owner",
              dataSource: [
                  { text: "Alex", value: 1, color: "#f8a398" },
                  { text: "Bob", value: 2, color: "#51a0ed" },
                  { text: "Charlie", value: 3, color: "#56ca85" }
              ]
          },
          {
            field: "atendees",
            multiple: true,
            dataSource: [
              { text: "Alex", value: 1 },
              { text: "Bob", value: 2 },
              { text: "Charlie", value: 3 }
            ]
          }
      ]
  });
  var scheduler = $("#scheduler").data("kendoScheduler");
  scheduler.bind("save", scheduler_save);
  scheduler.bind("add", scheduler_add);
  scheduler.bind("moveEnd", scheduler_move);
  scheduler.bind("resizeEnd", scheduler_resize);
  scheduler.bind("remove", scheduler_remove);

  var isAdding = false;
  function scheduler_add(e) {
    var scheduler = $("#scheduler").data("kendoScheduler");
    console.log(scheduler.dataSource.data());
    isAdding = true;
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
    }
    isAdding = false;
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
