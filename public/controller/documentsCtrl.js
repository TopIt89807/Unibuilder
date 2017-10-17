app.controller("documents", function($scope, dataService) {
  var emptydat = [
    {id: "files", value: "Files", open: true,  type: "folder", date:  new Date}
  ];

  var dat = [
			{id: "files", value: "Files", open: true,  type: "folder", date:  new Date(2014,2,10,16,10), data:[
				{ id: "documents", value: "Documents", date:  new Date(2014,2,10,16,10),  type: "folder", open: true, data:[
					{id: "presentations", value: "Presentations", type: "folder", date:  new Date(2014,2,10,16,10), data:[
						{id: "pres1", value: "October 2014.ppt", type:"pp", date: new Date(2014,2,10,16,10), size: "12830"},
						{id: "pres2", value: "June 2014.ppt",  type:"pp", date:  new Date(2014,2,10,16,10), size: "20100"},
						{id: "pres3", value: "April 2014.ppt", type:"pp", date:  new Date(2014,2,10,16,10), size: "15750"}
					]},
					{id: "reports", value: "Reports",  type: "folder", date: new Date(2014,2,10,16,10), open: true, data:[
						{id: "usa", value: "USA",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
							{id: "salesUS", value: "Sales USA.ppt",  type:"excel", date: new Date(2014,2,10,16,10), size: "12830"},
							{id: "overviewUS", value: "Overview USA.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"},
							{id: "pricesUS", value: "Prices USA.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "15830"},
							{id: "productsUS", value: "Products USA.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "20830"}
						]},
						{id: "europe", value: "Europe",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
							{id: "salesEurope", value: "Sales Europe.ppt",  type:"archive", date:  new Date(2014,2,10,16,10), size: "12830"},
							{id: "pricesEurope", value: "Prices Europe.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "15830"},
							{id: "productsEurope", value: "Products Europe.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "20830"},
							{id: "overviewEurope", value: "Overview Europe.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"}
						]},
						{id: "asia", value: "Asia",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
							{id: "salesAsia", value: "Sales Asia.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "12083"},
							{id: "pricesAsia", value: "Prices Asia.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "15830"},
							{id: "overviewAsia", value: "Overview Asia.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"},
							{id: "productsAsia", value: "Products Asia.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "20830"}
						]}
					]}
				]},
				{ id: "images", value: "Images", type: "folder", date:  new Date(2014,2,10,16,12), open: true, data:[
					{id: "thumbnails", value: "Thumbnails", type: "folder", date:  new Date(2014,2,10,16,12), data:[
						{id: "thumbnails1", value: "Product 1-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "34.83 KB"},
						{id: "thumbnails2", value: "Product 2-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "40.10 KB"},
						{id: "thumbnails3", value: "Product 3-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "33.75 KB"},
						{id: "thumbnails4", value: "Product 4-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "35.13 KB"},
						{id: "thumbnails5", value: "Product 5-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "34.72  KB"},
						{id: "thumbnails6", value: "Product 6-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "37.06  KB"}
					]},
					{id: "base", value: "Base images", type: "folder", date:  new Date(2014,2,10,16,12), data:[
						{id: "base1", value: "Product 1.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "74.83 KB"},
						{id: "base2", value: "Product 2.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "80.10 KB"},
						{id: "base3", value: "Product 3.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "73.75 KB"},
						{id: "base4", value: "Product 4.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "75.13 KB"},
						{id: "base5", value: "Product 5.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "74.72 KB" },
						{id: "base6", value: "Product 6.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "77.06 KB"}
					]}
				]},
				{ id: "video", value: "Video", type: "folder", date:  new Date(2014,2,10,16,12), data:[
					{id: "video1", value: "New Year 2013.avi", icon: "file-video-o", type:"video", date:  new Date(2014,2,10,16,12), size: "25030000", pId: "video" },
					{id: "video2", value: "Presentation.avi", icon: "file-video-o",type:"video", date:  new Date(2014,2,10,16,12), size: "11072000" , pId: "video"},
					{id: "video3", value: "Conference.avi", icon: "file-video-o", type:"video", date:  new Date(2014,2,10,16,12), size: "31256000", pId: "video" }
				]}
			]}
		];
  webix.ui({
    view:"filemanager",
    data: emptydat,
    container:"filemgr",
    id:"fmanager"
  });
  var fmgr = $$("fmanager"); //popup

  dataService.changeJob = function() {
    if($scope.jobname == undefined) {};
    if($scope.jobname == "All") {
    }else {
      var ref = firebase.database().ref('/documents/' + $scope.jobname);
      ref.once('value' , function(data) {
        $$("fmanager").clearAll();
        $$("fmanager").destructor();
        var dat = emptydat;
        if(data.val() != null)
          dat = data.val();

        webix.ui({
          view:"filemanager",
          data: data.val(),
          container:"filemgr",
          id:"fmanager"
        });

        var updateDB = function() {
          $$("fmanager").download("salesEurope");
          var ref = firebase.database().ref('/documents/' + $scope.jobname);
          var ary = $$("fmanager").serialize();
          console.log(ary);
          var str = JSON.stringify(ary);
          var res = str.replaceAll(/\u0024count/gi, "count");
          res = res.replaceAll(/\u0024parent/gi, "parent");
          res = res.replaceAll(/\u0024level/gi, "level");
          res = res.replaceAll(/\u0024template/gi, "template");
          res = JSON.parse(res);
          ref.set(res);
        }
        $$("fmanager").getMenu().add({
                id: "download",
                icon: "webix_icon fa-download",
                value: "Download",
                batch: "file"
        }, 0);
        $$("fmanager").getMenu().add({
      							$template:"Separator",
      							batch:"file"
      						}, 1);

        $$("fmanager").attachEvent("onAfterAdd", function(id, index){
          updateDB();
        });
        $$("fmanager").attachEvent("onAfterCreateFolder",function(){
          updateDB();
        });
        $$("fmanager").attachEvent("onAfterDeleteFile", function(){
          updateDB();
        });
        $$("fmanager").attachEvent("onAfterPasteFile", function(){
          updateDB();
        });
        $$("fmanager").attachEvent("onAfterDrop",function(context,ev){
          updateDB();
        });
        $$("fmanager").attachEvent("onAfterEditStop",function(id,state,editor,view){
          updateDB();
        });
        $$("fmanager").attachEvent("onBeforeFileUpload", function(response){
          console.log(response);
          var file = response.file;
          var metadata = {
              'contentType': file.type
          };

          var context = $$("fmanager").getMenu().getContext();
          //dataId - id of the clicked data item
          var pathary = $$("fmanager").getPath();
          var fburl = "";
          for(var i=0; i<pathary.length; i++)
            fburl += pathary[i] + "/";
          fburl += response.id;

          var storageRef = firebase.storage().ref();
          storageRef.child(fburl).put(file, metadata).then(function(snapshot) {
            alert("Succeed");
          });

          updateDB();
        });
        $$("fmanager").attachEvent("onItemClick", function(id){
          if(id == "download"){
            var context = $$("fmanager").getMenu().getContext();
            //dataId - id of the clicked data item
            var dataId = context.id;
            console.log(context.id);

            var pathary = $$("fmanager").getPath();
            var fburl = "";
            for(var i=0; i<pathary.length; i++)
              fburl += pathary[i] + "/";
            fburl += context.id.row;

            var storageRef = firebase.storage().ref();
            storageRef.child(fburl).getDownloadURL().then(function(url) {
              console.log(url);
              var a = document.createElement('a');
              a.href = url; // xhr.response is a blob
              a.download = "download"; // Set the file name.
              a.style.display = 'none';
              a.click();
              delete a;
            }).catch(function(error) {
              switch (error.code) {
                  case 'storage/object_not_found':
                    break;
                  case 'storage/unauthorized':
                    break;
                  case 'storage/canceled':
                    break;
                  case 'storage/unknown':
                    break;
                }
            });
          }
        });





      });
    }
  }
  dataService.changeJob();

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };



//  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
//    TableDatatablesManaged.init();
//  });
});
