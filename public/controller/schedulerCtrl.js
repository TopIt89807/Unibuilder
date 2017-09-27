app.controller("scheduler", function($scope, $timeout) {
  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }

  var jobsRef = firebase.database().ref('/joblist/');
  $scope.changeJob = function() {
    console.log($scope.jobname);
  }
  jobsRef.on('value', function(data) {
    var keys = [];
    for(var k in data.val()) {
      keys.push(k);
    }
    $scope.gridData = [];
    $scope.jobs = [
      {name:"All", value:"All"}
    ];
     $scope.jobname = $scope.jobs[0].value;
    for(var i=0; i<keys.length; i++) {
      var ref =  firebase.database().ref('/joblist/' + keys[i]);
      ref.once('value').then(function(snapshot) {
//        + "/" + $scope.getCurrentUID());
//      ref.once('value').then(function(snapshot) {
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
  var aa = [{"TaskID":4,"OwnerID":1,"Title":"Bowling tournament","Description":"","StartTimezone":null,"Start":"\/Date(1370811600000)\/","End":"\/Date(1370822400000)\/","EndTimezone":null,"RecurrenceRule":null,"RecurrenceID":null,"RecurrenceException":null,"IsAllDay":false},
          {"TaskID":5,"OwnerID":2,"Title":"Take the dog to the vet","Description":"","StartTimezone":null,"Start":"\/Date(1370939400000)\/","End":"\/Date(1370943000000)\/","EndTimezone":null,"RecurrenceRule":null,"RecurrenceID":null,"RecurrenceException":null,"IsAllDay":false},
          {"TaskID":6,"OwnerID":3,"Title":"Call Charlie about the project","Description":"","StartTimezone":null,"Start":"\/Date(1370950200000)\/","End":"\/Date(1370955600000)\/","EndTimezone":null,"RecurrenceRule":null,"RecurrenceID":null,"RecurrenceException":null,"IsAllDay":false}
  ];

  $scope.aaa = function() {
    var scheduler = $("#scheduler").data("kendoScheduler");
    console.log(scheduler.dataSource.data());
    // scheduler.dataSource.add( {
    //   start: new Date("2013/6/6 08:00 AM"),
    //   end: new Date("2013/6/6 09:00 AM"),
    //   title: "Interview"
    // });
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
          data:aa,
          schema: {
              model: {
                  id: "taskId",
                  fields: {
                      taskId: { from: "TaskID", type: "number" },
                      title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                      start: { type: "date", from: "Start" },
                      end: { type: "date", from: "End" },
                      startTimezone: { from: "StartTimezone" },
                      endTimezone: { from: "EndTimezone" },
                      description: { from: "Description" },
                      recurrenceId: { from: "RecurrenceID" },
                      recurrenceRule: { from: "RecurrenceRule" },
                      recurrenceException: { from: "RecurrenceException" },
                      ownerId: { from: "OwnerID", defaultValue: 1 },
                      isAllDay: { type: "boolean", from: "IsAllDay" }
                  }
              }
          }
      },
      save: function(e) {
        var start = e.start;
        var end = e.end;
        //alert('a');
        console.log(kendo.format("Selection between {0:g} and {1:g}", start, end));
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


  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
//    TableDatatablesManaged.init();
    ComponentsBootstrapSelect.init();
  });
});
