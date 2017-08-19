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

  $scope.gridData = [
    { FirstName: "form_modal2", LastName: "abc", Country:"AAA", City:"AE" },
    { FirstName: "Foo3", LastName: "abc", Country:"AAA", City:"AE" },
    { FirstName: "form_modal1", LastName: "abc", Country:"AAA", City:"AE" },
    { FirstName: "Foo4", LastName: "abc", Country:"AAA", City:"AasE" },
  ];

  $scope.ds = new kendo.data.DataSource({
    data:$scope.gridData,
    pageSize:5
  });

  $scope.gridOptions = {
/*    dataSource: {
      data:$scope.gridData,
      pageSize:3
    },*/
    columns: [

        {field:"FirstName", title:"First Name", width:"100px"},
        {field:"LastName", title:"Last Name"},
        {field:"Country"},
        {field:"City", title:"City"}
    ],
    toolbar: ["excel"],
    excel: {
        fileName: "Products.xlsx"
    },
    pageable: {
        pageSizes: [2, 3, 4, "all"],
        refresh: true,
        buttonCount: 5
    },
    selectable: true,
    sortable: true,
    resizable: true
  }

  var jobsRef = firebase.database().ref('/jobs/');
  jobsRef.on('child_added', function(data) {
    $scope.gridData.pop();
    var obj = [
      {id: data.key, first: data.fname}
    ];
  });

  var jobsRef = firebase.database().ref('/jobs/');
  var keys = [];
  jobsRef.on('value', function(data) {
    for(var k in data.val()) {
      keys.push(k);
    }
    alert(keys);
  });

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    ComponentsBootstrapMultiselect.init();
    ComponentsBootstrapMultiselect.fff();
    ComponentsDateTimePickers.init();
//    MapsGoogle.init();
//    TableDatatablesRowreorder.init();
  });



/*  $scope.refreshtable = function() {
    $scope.gridData = [{ FirstName: "form_modal2", LastName: "abc", Country:"AAA", City:"AE" }];
    $scope.ds.data = $scope.gridData;
    $scope.ds = new kendo.data.DataSource({
      data:$scope.gridData,
      pageSize:1
    });
  }*/


  $scope.reload = function() {
    $("#gmap_marker").css("width", "100%");
    $("#gmap_marker").css("height", "500px");
    MapsGoogle.init();
  }
});
