app.controller("documents", function($scope, $timeout) {
  $scope.gridData = [];
  $scope.ds = new kendo.data.DataSource({
    data:$scope.gridData,
    pageSize:50
  });
  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }

  $scope.assetsData = [];
  var onChange = function(args) {
    var model = this.dataItem(this.select());
    var key = model.JobKey;
    $("#detail").modal('show');
    $scope.viewDetail(key);
  }
  $scope.viewDetail = function(key) {
    $scope.job_key = key;
    $scope.openPath("");
  }
  $scope.currentPath = "";
  $scope.makeNewFolder = function() {
    bootbox.prompt("Enter New Folder Name.", function(result) {
        if (result === null) {
            //alert("Prompt dismissed");
        } else {
            $scope.$apply(function() {
//              var nod = {name: result, type: true};
//              $scope.assetsData.push(nod);
              var newKey = firebase.database().ref().child('documents').push().key;
              var ref = firebase.database().ref('/documents/' + $scope.job_key + '/' + $scope.currentPath + result + "/" + newKey);
              ref.set({name: "..", isDirectory: true});
            });
        }
    });
  }
  var strip = function(path) { return path.substring(0, path.substring(0,path.length-1).lastIndexOf('/')+1); }
  $scope.openPath = function(path) {
    if(path != "..")
      $scope.currentPath = $scope.currentPath + path + "/";
    else $scope.currentPath = strip($scope.currentPath);
    var ref = firebase.database().ref('/documents/' + $scope.job_key + '/' + $scope.currentPath);
    $scope.assetsData = [];
    ref.on('value', function(data) {
      $scope.assetsData = [];
      var keys = [];
      for(var k in data.val()) {
        keys.push(k);
      }

      for(var i=0; i<keys.length; i++) {
        var subref = ref.child(keys[i]);
        //var subref =  firebase.database().ref('/documents/' + $scope.job_key + '/' + $scope.currentPath + keys[i]);
        subref.once('value').then(function(snapshot) {
          var nod = {
            name: snapshot.val().name != undefined? snapshot.val().name : snapshot.key,
            isDirectory: snapshot.val().isDirectory
          }
          console.log(snapshot.val());
          $scope.assetsData.push(nod);
          $scope.$apply();
        });
      }
    });
  }

  $scope.gridOptions = {
/*    dataSource: {
      data:$scope.gridData,
      pageSize:3
    },*/
    selectable: true,
    change: onChange,
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

        $("table.k-focusable tbody tr").hover(
          function() {
           $(this).toggleClass("k-state-hover");
          }

        );
    },
    columns: [
        {field:"JobKey", hidden:true},
        {field:"JobColor", title:" ", width:"30px", encoded: false},
        {field:"JobName", title:"Job Name", encoded: false},
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
    sortable: true,
    resizable: true
  }
  var jobsRef = firebase.database().ref('/joblist/');
  jobsRef.on('value', function(data) {
    var keys = [];
    for(var k in data.val()) {
      keys.push(k);
    }
    $scope.gridData = [];
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
*/            var col = {
                JobKey: snapshot.ref.parent.key,
                JobColor: snapshot.val().jobcolor,
                JobName: snapshot.val().jobname,
            }

            $scope.gridData.push(col);
            $scope.ds = new kendo.data.DataSource({
              data:$scope.gridData,
              pageSize:50
            });
            $scope.$apply();
          }
        });
      });
    }


  });

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    TableDatatablesManaged.init();
  });
});
