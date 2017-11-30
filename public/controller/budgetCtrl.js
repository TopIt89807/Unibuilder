app.controller("budget", function($scope, $timeout) {
  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }

  $scope.gridData = [];

  $scope.ds = new kendo.data.DataSource({
    data:$scope.gridData,
    pageSize:50
  });

  $scope.gridOptions = {
/*    dataSource: {
      data:$scope.gridData,
      pageSize:3
    },*/
    selectable: true,
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
        {field:"JobColor", title:" ", width:"30px", encoded: false, filterable: false},
        {field:"JobName", title:"Job Name", width:"270px", encoded: false},
        {field:"BudgetedAmount", title:"Budgeted Amount", width:"170px"},
        {field:"EstimatedRevenue", title:"Estimated Revenue", width:"170px"},
        {field:"Budget", title:"(+/-)Budget", width:"120px"},
        {field:"TotalVendorCost", title:"Total Vendor Cost", width:"170px"},
        {field:"OverheadInHouse", title:"Overhead/InHouse", width:"170px"},
        {field:"EstimatedProfit", title:"Estimated Profit", width:"170px"},
        {field:"BilledToClientToDate", title:"Billed To Client To Date", width:"200px"},
        {field:"BalanceToBillToClient", title:"Balance To Bill To Client", width:"200px"},
        {field:"PaidByClientToDate", title:"Paid By Client To Date", width:"200px"},
        {field:"UnPaidClientBillings", title:"Unpaid Client Billings", width:"200px"},
        {field:"InvoicedBySubToDate", title:"Invoiced By Sub To Date", width:"220px"},
        {field:"AmountPaidToSub", title:"AmountPaidToSub", width:"170px"},
        {field:"BalanceToBeInvoicedBySub", title:"Balance To Be Invoiced By Sub", width:"260px"},
        {field:"TotalBalanceOwedToSub", title:"Total Balance Owed To Sub", width:"240px"},
        {field:"TotalCost", title:"Total Cost", width:"120px"},
        {field:"ProfitToDate", title:"Profit To Date", width:"170px"},
        {field:"OverallProfit", title:"Overall Profit", width:"170px"},
        {field:"Profit", title:"Profit %", width:"120px"},
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
    editable: true,
    navigatable: true,
    reorderable: true,
    columnMenu: true,
    filterable: {
      mode: "row"
    },
    resizable: true
  }

  var data = [
    {JobName:"<b>asd</b>", ba:23, er:23, budget:23, tvc:98, ohih:2332, ep:12, btctd:283, btbtc:29832, pbctd:298, upcb:3732, ibstd:8293, apts:2352, btbibs:95, tbots:25, ts:23895, ptd:25, op:235, profit:235},
    {JobName:"sdkdslj", ba:23, er:23, budget:23, tvc:98, ohih:2332, ep:12, btctd:283, btbtc:29832, pbctd:298, upcb:3732, ibstd:8293, apts:2352, btbibs:95, tbots:25, ts:23895, ptd:25, op:235, profit:235},
    {JobName:"sdkdslj", ba:23, er:23, budget:23, tvc:98, ohih:2332, ep:12, btctd:283, btbtc:29832, pbctd:298, upcb:3732, ibstd:8293, apts:2352, btbibs:95, tbots:25, ts:23895, ptd:25, op:235, profit:235},
    {JobName:"sdkdslj", ba:23, er:23, budget:23, tvc:98, ohih:2332, ep:12, btctd:283, btbtc:29832, pbctd:298, upcb:3732, ibstd:8293, apts:2352, btbibs:95, tbots:25, ts:23895, ptd:25, op:235, profit:235},
  ];
  $scope.gridData = [];
  for(var i=0; i<data.length; i++) {

    var col = {
        JobKey: "aaa",
        JobColor: "#ff0000",
        JobName: data[i].JobName,
        BudgetedAmount: data[i].ba,
        EstimatedRevenue: data[i].er,
        Budget: data[i].budget,
        TotalVendorCost: data[i].tvc,
        OverheadInHouse: data[i].ohih,
        EstimatedProfit: data[i].ep,
        BilledToClientToDate: data[i].btctd,
        BalanceToBillToClient: data[i].btbtc,
        PaidByClientToDate: data[i].pbctd,
        UnPaidClientBillings: data[i].upcb,
        InvoicedBySubToDate: data[i].ibstd,
        AmountPaidToSub: data[i].apts,
        BalanceToBeInvoicedBySub: data[i].btbibs,
        TotalBalanceOwedToSub: data[i].tbots,
        TotalCost: data[i].ts,
        ProfitToDate: data[i].ptd,
        OverallProfit: data[i].op,
        Profit: data[i].profit
    }

    $scope.gridData.push(col);
    $scope.ds = new kendo.data.DataSource({
      data:$scope.gridData,
      pageSize:50
    });

    //$scope.$apply();
  }


  /*var jobsRef = firebase.database().ref('/joblist/');
  jobsRef.on('value', function(data) {
    var keys = [];
    for(var k in data.val()) {
      keys.push(k);
    }
    $scope.gridData = [];
    for(var i=0; i<keys.length; i++) {
      var ref = firebase.database().ref('/joblist/' + keys[i]);
      ref.once('value').then(function(snapshot) {
//        + "/" + $scope.getCurrentUID());
//      ref.once('value').then(function(snapshot) {
        var jobID = snapshot.key;
        var creatorID = snapshot.val().creatorID;
        var deleted = snapshot.val().deleted != undefined? snapshot.val().deleted : false;
        if(!deleted) {

          firebase.database().ref('/jobs/' + jobID + '/' + $scope.getCurrentUID()).once('value').then(function(snapshot) {
            var access = snapshot.val().access;
            if(access.charAt(2) == 'v') {
              firebase.database().ref('/jobs/' + jobID + '/' + creatorID).once('value').then(function(snapshot) {

                  var projmgr = "";
                  var cnt = snapshot.val().projmgr != undefined? Object.keys(snapshot.val().projmgr).length : 0;
                  for(var j=0; j<cnt; j++) {
                    projmgr += snapshot.val().projmgr[j] + "<br/>";
                  }
                  editable = access.charAt(1) != 'e'? 0 : 1;
                  if(access.charAt(1) != 'e') {
                    $("#large").find('*').attr("disabled", true);
                  }else {
                    $("#large").find('*').attr("disabled", false);
                  }
                  var col = {
                      JobKey: snapshot.ref.parent.key,
                      JobColor: snapshot.val().jobcolor,
                      JobName: "<a id='aass' data-toggle='modal' href='joblist#large' ng-click='viewDetailMode(\"" + snapshot.ref.parent.key + "\");'>"+snapshot.val().jobname+"</a>",
                      Addr: snapshot.val().address,
                      City: snapshot.val().city,
                      State: snapshot.val().state,
                      Zip: snapshot.val().zip,
                      Pjmgr: projmgr/* + "   <a><img src='assets/images/more.png'/></a>"*//*,
                      Owner: "owner",
                      Phone: "<a href='tel:22222222'>22222222</a>",
                      Cell: "<a href='tel:22222222'>22222222</a>",
                      Status: "<img src='assets/images/online.png'/>Online",
                      Map: "<img src='assets/images/" + (snapshot.val().mapped == "mapped"? "marker.png" : "marker_gray.png") + "'/>",
                      CCLimit: "Not Accepted",
                      ACHLimit: "Not Accepted"
                  }

                  $scope.gridData.push(col);
                  $scope.ds = new kendo.data.DataSource({
                    data:$scope.gridData,
                    pageSize:50
                  });

                  $scope.$apply();
              });
            }
          });

        }
      });
    }
  });*/

});
