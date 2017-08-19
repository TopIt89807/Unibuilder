app.controller("joblist", function($scope) {
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

  alert('a');

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    ComponentsBootstrapMultiselect.init();
    ComponentsBootstrapMultiselect.fff();
    ComponentsDateTimePickers.init();
    TableDatatablesRowreorder.init();
//    MapsGoogle.init();
  });
  $scope.reload = function() {
    $("#gmap_marker").css("width", "100%");
    $("#gmap_marker").css("height", "500px");
    MapsGoogle.init();
  }
});
