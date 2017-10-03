app.controller("gantt", function($scope, dataService) {
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
  var ganttData = [];

//  $scope.changeJob = function() {
  dataService.changeJob = function() {
    if($scope.jobname == "All") {

      var ref = firebase.database().ref('/schedule/');
      ref.on('value', function(data) {
        if($scope.jobname == "All") {
          ganttData = [];
          var gantt = $("#gantt").data("kendoGantt");
          gantt.dataSource.data(ganttData);

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
                  var enddate = new Date(jsonobj.end);
                  if(jsonobj.isAllDay) {
                    jsonobj.end = new Date(enddate.getTime() + 24 * 60 * 60 * 1000);
                  }else
                    jsonobj.end = enddate;
                  jsonobj.percentComplete = 0.0;

                  ganttData.push(jsonobj);
                  gantt.dataSource.data(ganttData);
                  if(gantt.range.start > jsonobj.start) gantt.range.start = jsonobj.start;
                  if(gantt.range.end < jsonobj.end) gantt.range.end = jsonobj.end;
                });
              }

            });
          }
        }
      });

    } else {

      var ref = firebase.database().ref('/schedule/' + $scope.jobname);
      ref.once('value', function(data) {
        ganttData = [];
        var gantt = $("#gantt").data("kendoGantt");
        gantt.dataSource.data(ganttData);

        var keys = [];
        for(var k in data.val()) {
          keys.push(k);
        }
        for(var i=0; i<keys.length; i++) {
          var ref =  firebase.database().ref('/schedule/' + $scope.jobname + '/' + keys[i]);
          ref.once('value').then(function(snapshot) {
            var jsonobj = JSON.parse(JSON.stringify(snapshot.val()));
            jsonobj.start = new Date(jsonobj.start);
            var enddate = new Date(jsonobj.end);
            if(jsonobj.isAllDay) {
              jsonobj.end = new Date(enddate.getTime() + 24 * 60 * 60 * 1000);
            }else
              jsonobj.end = enddate;
            ganttData.push(jsonobj);
            gantt.dataSource.data(ganttData);
            if(gantt.range.start > jsonobj.start) gantt.range.start = jsonobj.start;
            if(gantt.range.end < jsonobj.end) gantt.range.end = jsonobj.end;
          });
        }
      });

    }
  }

  $("#gantt").kendoGantt({
    theme: "bootstrap",
//    date: new Date(),
    dataSource: {
      data:[
        {
          title:"Bowling tournament",
          start:new Date("2017/8/18 9:00"),
          end:new Date("2017/8/20 11:00")
        },
        {
          title: "Task1",
          start: new Date("2017/8/17 9:00"),
          end: new Date("2017/9/01 11:00")
        },
        {
          title: "Task2",
          start: new Date("2017/8/20 12:00"),
          end: new Date("2017/90/02 14:00")
        }
      ],
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
            percentComplete: { from: "percentComplete", type: "number" },

            //id: { from: "id", type: "number" },
            //orderId: { from: "orderId", type: "number", validation: { required: true } },
            //parentId: { from: "parentId", type: "number", validation: { required: true } },
            //start: { from: "start", type: "date" },
            //end: { from: "end", type: "date" },
            //title: { from: "title", defaultValue: "", type: "string" },
            //percentComplete: { from: "percentComplete", type: "number" },
            //summary: { from: "summary" },
            //expanded: { from: "expanded" }
          }
        }
      }
    },
    /*resources: {
      dataSource: [
        { id: 0, name: "Resource 1", color: "green", format: "p0" },
        { id: 1, name: "Resource 2", color: "#32cd32", format: "p0" }
      ]
    },
    assignments: {
      dataSource: [
        { taskId: 0, resourceId: 0, value: 1 },
        { taskId: 0, resourceId: 1, value: 1 },
        { taskId: 1, resourceId: 1, value: 1 }
      ]
    },*/
    views: ["week", "day"],
    columns: [
      // { field: "id", title: "ID" },
      { field: "title", title: "Title" },
      //{ field: "dur", title: "Dur." },
      { field: "start", title: "Start", format: "{0:yyyy/MM/dd hh:mm tt}"},
      { field: "end", title: "Finish", format: "{0:yyyy/MM/dd hh:mm tt}"},
      // { field: "title", title: "Assigned To" },
      // { field: "title", title: "Pred" },
      // { field: "title", title: "Status" },
      // { field: "resources", title: "Task Resources" }
    ],
    dataBound: onDataBound
  });

  function onDataBound() {
    var gantt = this;

    gantt.element.find(".k-task").each(function(e) {
      var dataItem = gantt.dataSource.getByUid($(this).attr("data-uid"));

      // colorize task per business requirements
      if (dataItem.percentComplete < .5) {
        this.style.backgroundColor = dataItem.colorId;
      } else {
        this.style.backgroundColor = dataItem.colorId;
      }
    });
  }

  /*$("#scheduler").kendoScheduler({
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
    scheduler.resources[1].dataSource.add(assignee[i]);*/
  var gantt = $("#gantt").data("kendoGantt");

  gantt.bind("save", gantt_save);
  gantt.bind("moveEnd", gantt_move);
  gantt.bind("resizeEnd", gantt_resize);
  gantt.bind("edit", gantt_edit);
  gantt.bind("remove", gantt_remove);

  var isEditing = false;
  function gantt_edit(e) {
    isEditing = true;
  }
  function gantt_save(e) {
    var gantt = $("#gantt").data("kendoGantt");
    if(isEditing) {
      var JobKey = $scope.jobname;
      var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.task.cloneid);
      var json = JSON.parse(JSON.stringify(e.task));
      console.log(json);

      var enddate = new Date(json.end);
      if(json.isAllDay) {
        json.end = new Date(enddate.getTime() - 24 * 60 * 60 * 1000);
      }else
        json.end = enddate;

      ref.once('value').then(function(snapshot) {
        ref.update(json);
      });
      isEditing = false;
    }
  }
  function gantt_move(e) {
    var JobKey = $scope.jobname;
    var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.task.cloneid);
    var json = JSON.parse(JSON.stringify(e.task));
    json.start = e.start;
    json.end = e.end;
    console.log(json);
    var enddate = new Date(json.end);
    if(json.isAllDay) {
      json.end = new Date(enddate.getTime() - 24 * 60 * 60 * 1000);
    }else
      json.end = enddate;

    ref.once('value').then(function(snapshot) {
      ref.update(json);
    });
  }
  function gantt_resize(e) {
    var JobKey = $scope.jobname;
    var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.task.cloneid);
    var json = JSON.parse(JSON.stringify(e.task));
    json.start = e.start;
    json.end = e.end;
    console.log(json);
    var enddate = new Date(json.end);
    if(json.isAllDay) {
      json.end = new Date(enddate.getTime() - 24 * 60 * 60 * 1000);
    }else
      json.end = enddate;

    ref.once('value').then(function(snapshot) {
      ref.update(json);
    });
  }
  function gantt_remove(e) {
    var JobKey = $scope.jobname;
    var ref =  firebase.database().ref('/schedule/' + JobKey + '/' + e.task.cloneid);
    ref.once('value').then(function(snapshot) {
      ref.remove();
    });
  }



  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
//    TableDatatablesManaged.init();
//    ComponentsBootstrapSelect.init();
  });
});
