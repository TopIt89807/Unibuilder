app.controller("joblist", function($scope, $timeout) {
  $scope.jobgroups = ["group1", "group2", "group3"];
  $scope.records = ["27 shadow cantyyon, investor",
     "Al Qarrous, Mohammed",
     "Anderson, CHarmagne",
     "Bamhart, Bob"];
  $scope.jobstatus = [
      {model : "--- Open or Closed ---", value : "any"},
      {model : "Open Jobsites Only", value : "Open"},
      {model : "Closed Jobsites Only", value : "Closed"}
  ];
  $scope.jobtype = [
         {model : "New Homes", value : "new"},
         {model : "Remodels", value : "remodel"},
         {model : "Specialty(Other)", value : "other"},
         {model : "Sample Job", value : "sample"}
     ];
  $scope.mappedstatus = [
     {model:"All Jobs", value:"all"},
     {model:"Mapped Jobs", value:"mapped"},
     {model:"Unmapped Jobs", value:"unmapped"}
   ];

  $scope.l_jobstatus = $scope.jobstatus[0].value;
  $scope.l_mappedstatus = $scope.mappedstatus[0].value;
  $scope.jlists = [];

  $scope.gridData = [];
  $scope.gridmapData = [];

  $scope.ds = new kendo.data.DataSource({
    data:$scope.gridData,
    pageSize:50
  });

  $scope.dsmap = new kendo.data.DataSource({
    data:$scope.gridmapData,
    pageSize:50
  });
  $scope.gridOptions = {
/*    dataSource: {
      data:$scope.gridData,
      pageSize:3
    },*/
    dataBound: function(e) {
        // get the index of the UnitsInStock cell
        var columns = e.sender.columns;
        var columnIndex = this.wrapper.find(".k-grid-header [data-field=" + "JobColor" + "]").index();

        // iterate the data items and apply row styles where necessary
        var dataItems = e.sender.dataSource.view();
        for (var j = 0; j < dataItems.length; j++) {
          var units = dataItems[j].get("JobColor");

          var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
          var cell = row.children().eq(columnIndex);
          cell.css("background-color", units);
          cell.css("color", units);
        }
    },
    columns: [
        {field:"JobKey", hidden:true},
        {field:"JobColor", title:" ", width:"30px", encoded: false},
        {field:"JobName", title:"Job Name", width:"270px", encoded: false},
        {field:"Addr", title:"Street Address", width:"220px"},
        {field:"City", title:"City", width:"130px"},
        {field:"State", title:"State", width:"100px"},
        {field:"Zip", title:"Zip", width:"100px"},
        {field:"Pjmgr", title:"Proj. Manager", width:"280px", encoded: false},
        {field:"Owner", title:"Owner", width:"250px"},
        {field:"Phone", title:"Phone", width:"100px", encoded: false},
        {field:"Cell", title:"Cell", width:"100px", encoded: false},
        {field:"Status", title:"Cal. Status", width:"100px", encoded: false},
        {field:"Map", title:"Map", width:"80px", encoded: false},
        {field:"CCLimit", title:"CC Limit", width:"140px"},
        {field:"ACHLimit", title:"ACH Limit", width:"140px"}
    ],
/*    toolbar: ["excel"],
    excel: {
        fileName: "Products.xlsx"
    },*/
    pageable: {
        pageSizes: [20, 50, 75, 100, 250],
        refresh: true,
        buttonCount: 5
    },
    selectable: true,
    sortable: true,
    resizable: true
  }
  $scope.gridmapOptions = {
    columns: [
        {field:"Map", title:"Map", width:"50px", encoded: false},
        {field:"JobName", title:"Job Name", encoded: false},
        {field:"More", title:"More", width:"50px", encoded: false}
    ],
    pageable: {
        pageSizes: [20, 50, 75, 100, 250],
        buttonCount: 5,
        info: false
    },
  }

  /*var jobsRef = firebase.database().ref('/jobs/');
  jobsRef.on('child_added', function(data) {
    $scope.gridData.pop();
    var obj = [
      {id: data.key, first: data.fname}
    ];
  });*/

  var jobsRef = firebase.database().ref('/jobs/');
  jobsRef.on('value', function(data) {
    var keys = [];
    for(var k in data.val()) {
      keys.push(k);
    }
    $scope.gridData = [];
    $scope.gridmapData = [];
    for(var i=0; i<keys.length; i++) {
      var ref =  firebase.database().ref('/jobs/' + keys[i]);
      ref.once('value').then(function(snapshot) {
        var projmgr = "";
        var cnt = snapshot.val().projmgr != undefined? Object.keys(snapshot.val().projmgr).length : 0;
        for(var j=0; j<cnt; j++) {
          projmgr += snapshot.val().projmgr[j] + "<br/>";
        }
          var col = {
              JobKey: keys[i],
              JobColor: snapshot.val().jobcolor,
              JobName: "<a data-toggle='modal' href='joblist#large' ng-click='viewDetailMode(\"" + snapshot.key + "\");'>"+snapshot.val().jobname+"</a>",
              Addr: snapshot.val().address,
              City: snapshot.val().city,
              State: snapshot.val().state,
              Zip: snapshot.val().zip,
              Pjmgr: projmgr/* + "   <a><img src='assets/images/more.png'/></a>"*/,
              Owner: "owner",
              Phone: "<a href='tel:22222222'>22222222</a>",
              Cell: "<a href='tel:22222222'>22222222</a>",
              Status: "<img src='assets/images/online.png'/>Online",
              Map: "<img src='assets/images/marker.png'/>",
              CCLimit: "Not Accepted",
              ACHLimit: "Not Accepted"
          }

          $scope.gridData.push(col);
          $scope.ds = new kendo.data.DataSource({
            data:$scope.gridData,
            pageSize:50
          });

          var colmap = {
              Map: "<img src='assets/images/marker.png'/>",
              JobName: "<a href='#!/jobs'>"+snapshot.val().jobname+"</a>",
              More: "<img src='assets/images/zoom.png'/>"
          }
          $scope.gridmapData.push(colmap);
          $scope.dsmap = new kendo.data.DataSource({
            data:$scope.gridmapData,
            pageSize:50
          });
          $scope.$apply();
      });
    }

  });

/**
******Data when click job name on job list
*/
  $scope.viewDetailMode = function(val) {
    var ref =  firebase.database().ref('/jobs/' + val);
    ref.once('value').then(function(snapshot) {
      $scope.detail_jobname = snapshot.val().jobname != undefined? snapshot.val().jobname : null;
      $scope.detail_jobstatus = snapshot.val().status;
      $scope.detail_jobtype = snapshot.val().jobtype;
      $scope.detail_projmgr = snapshot.val().projmgr != undefined? snapshot.val().projmgr : null;
      $scope.detail_notify = snapshot.val().notify;
      $scope.detail_jobgroup = snapshot.val().jobgroup != undefined? snapshot.val().jobgroup : null;
      $scope.detail_jprefix = snapshot.val().jobprefix != undefined? snapshot.val().jobprefix : null;
      $scope.detail_address = snapshot.val().address != undefined? snapshot.val().address : null;
      $scope.detail_lotinfo = snapshot.val().lotinfo != undefined? snapshot.val().lotinfo : null;
      $scope.detail_city = snapshot.val().city != undefined? snapshot.val().city : null;
      $scope.detail_state = snapshot.val().state != undefined? snapshot.val().state : null;
      $scope.detail_zip = snapshot.val().zip != undefined? snapshot.val().zip : null;
      $scope.detail_permit = snapshot.val().permit != undefined? snapshot.val().permit : null;
      $scope.detail_price = snapshot.val().price != undefined? snapshot.val().price : null;
      $scope.detail_projstart = snapshot.val().pstart != undefined? snapshot.val().pstart : null;
      $scope.detail_actstart = snapshot.val().astart != undefined? snapshot.val().astart : null;
      $scope.detail_projcompletion = snapshot.val().pcom != undefined? snapshot.val().pcom : null;
      $scope.detail_actcompletion = snapshot.val().acom != undefined? snapshot.val().acom : null;
      $scope.detail_workdays = snapshot.val().workdays;
      $scope.detail_jobcolor = snapshot.val().jobcolor != undefined? snapshot.val().jobcolor : null;
      $scope.detail_internal = snapshot.val().internal != undefined? snapshot.val().internal : null;
      $scope.detail_sub = snapshot.val().sub != undefined? snapshot.val().sub : null;
      $scope.detail_jobkey = val;
      $scope.detail_userkey = snapshot.val().uid;
      $scope.detail_fname = snapshot.val().fname != undefined? snapshot.val().fname : null;
      $scope.detail_lname = snapshot.val().lname != undefined? snapshot.val().lname : null;
      $scope.detail_email = snapshot.val().email != undefined? snapshot.val().email : null;
      $scope.detail_mapimg = (snapshot.val().mapped != undefined && snapshot.val().mapped == "mapped")? "marker.png" : "marker_gray.png";
      $scope.detail_mapstatus = snapshot.val().mapped != undefined? snapshot.val().mapped : null;
      $scope.lat = snapshot.val().lat != undefined? snapshot.val().lat : null;
      $scope.lng = snapshot.val().lng != undefined? snapshot.val().lng : null;
      $scope.$apply();
    });
  }

  $scope.onSaveJobs = function() {

    updateJob($scope.detail_userkey, $scope.detail_jobkey,
        $scope.detail_fname, $scope.detail_lname, $scope.detail_email,
        $scope.detail_jobname, $scope.detail_jobstatus, $scope.detail_jobtype, $scope.detail_projmgr,
         $scope.detail_notify, $scope.original_jobgroups, $scope.detail_jobgroup, $scope.detail_jprefix,
        $scope.detail_address, $scope.detail_lotinfo, $scope.detail_city, $scope.detail_state, $scope.detail_zip, $scope.detail_permit, $scope.detail_price,
        $scope.detail_projstart, $scope.detail_actstart, $scope.detail_projcompletion, $scope.detail_actcompletion, $scope.detail_workdays, $scope.detail_jobcolor,
        $scope.detail_internal, $scope.detail_sub, $scope.detail_mapstatus, $scope.lat, $scope.lng);
  }

  $scope.original_jobstatus = [
          {model : "Open", value : "Open"},
          {model : "Closed", value : "Closed"}
      ];
  $scope.original_jobtype = [
          {model : "-- Please Select --", value : "none"},
          {model : "New Home", value : "new"},
          {model : "Remodel", value : "remodel"},
          {model : "Specialty(Other)", value : "other"}
      ];
  $scope.original_jobgroups = [];
  $scope.original_records = ["27 shadow cantyyon, investor",
     "Al Qarrous, Mohammed",
     "Anderson, CHarmagne",
     "Bamhart, Bob"];
  $scope.c_jobstatus= $scope.jobstatus[0].value;
  $scope.c_jobtype= $scope.jobtype[0].value;
  $scope.c_notify=false;
  $scope.detail_workdays = [false, false, false, false, false, false, false];

  $scope.original_colors = [
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

  $scope.original_workdays = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];

  $scope.onJobGroupAdd = function() {
    bootbox.prompt("Adding a job group. Enter title.", function(result) {
        if (result === null) {
            //alert("Prompt dismissed");
        } else {
            $scope.$apply(function() {
              $scope.original_jobgroups.push(result);
            });
        }
    });
  }
  var map;
  $scope.onMapping = function() {
    $timeout(function () {

        $("#gmap_marker2").css("width", "100%");
        $("#gmap_marker2").css("height", "800px");
        var latitude = $scope.detail_mapimg == "marker.png" ? $scope.lat : 36.18665862660455;
        var longitude = $scope.detail_mapimg == "marker.png" ? $scope.lng : -115.13397216796875;
        map = new GMaps({
            div: '#gmap_marker2',
            lat: latitude,
            lng: longitude,
        });

        map.addMarker({
            lat: latitude,
            lng: longitude,
            title: 'MyMarker',
            click: function (e) {
                if (console.log) console.log(e);
                alert('You clicked in this marker');
            }
        });

        map.addListener('click', function(e) {
          map.removeMarkers();
          map.addMarker({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
              title: 'MyMarker',
              click: function (e) {
                  if (console.log) console.log(e);
                  alert('You clicked in this marker');
              }
          });

          console.log(e.latLng.lat());
          console.log(e.latLng.lng());
          $scope.lat = e.latLng.lat();
          $scope.lng = e.latLng.lng();
        });
        /*map.addMarker({
           lat: -51.38739,
                lng: -6.187181,
            title: 'Lima',
            details: {
                database_id: 42,
                author: 'HPNeo'
            },
            click: function (e) {
                if (console.log) console.log(e);
                alert('You clicked in this marker');
            }
        });
        map.addMarker({
            lat: -12.042,
            lng: -77.028333,
            title: 'Marker with InfoWindow',
            infoWindow: {
                content: '<span style="color:#000">HTML Content!</span>'
            }
        });*/
        map.setZoom(11);
      }, 500);
  }
  $scope.onSaveMapping = function() {
    if(map.markers.length == 0)
      $scope.detail_mapstatus = "unmapped";
    else if(map.markers.length == 1)
      $scope.detail_mapstatus = "mapped";
    $scope.detail_mapimg = ($scope.detail_mapstatus == "mapped")? "marker.png" : "marker_gray.png";
  }

  $scope.changeColor = function() {
    $("#jobcolorselect").css("background-color", $scope.detail_jobcolor);
  }

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    ComponentsBootstrapMultiselect.init();
    ComponentsBootstrapMultiselect.fff();
    ComponentsDateTimePickers.init();
//    TableDatatablesRowreorder.init();
  });

  $scope.reload = function() {
    $("#gmap_marker").css("width", "100%");
    $("#gmap_marker").css("height", "500px");
    MapsGoogle.init();
  }
});
