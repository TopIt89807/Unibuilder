app.controller("documents", function($scope, dataService) {
  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }

  var emptydat = [
    {id: "files", value: "Files", open: true,  type: "folder", date:  new Date}
  ];

  webix.ui({
    view:"filemanager",
    data: emptydat,
    container:"filemgr",
    id:"fmanager"
  });
  var fmgr = $$("fmanager"); //popup

  dataService.changeJob = function() {
    if($scope.jobname == undefined) {return;}
    if($scope.jobname == "All") {
      $$("fmanager").attachEvent("onBeforeCreateFolder",function(id){
          return false;
      });
      $$("fmanager").attachEvent("onBeforeUploadDialog",function(file_config){
        return false;
      });
      $$("fmanager").attachEvent("onBeforeDrag",function(context,ev){
        return false;
      });
      $$("fmanager").attachEvent("onBeforeEditFile",function(id,state,editor,view){
        return false;
      });
      $$("fmanager").attachEvent("onBeforeMarkCut", function(ids){
        return false;
      });
      $$("fmanager").attachEvent("onBeforeMarkCopy", function(ids){
        return false;
      });
      $$("fmanager").attachEvent("onBeforeDeleteFile", function(id){
        return false;
      });
    }else {
      var ref = firebase.database().ref('/documents/' + $scope.jobname);
      ref.once('value' , function(data) {

        var userid = $scope.getCurrentUID();
        var fileref = firebase.database().ref('/jobs/' + $scope.jobname + '/' + userid);
        fileref.once('value').then(function(snapshot) {
            var access = snapshot.val().fileaccess != undefined? snapshot.val().fileaccess : "-----";
            var cc,uu,vv,ee,dd;
            if(access.charAt(0) == 'c')
              cc = true;
            else if(access.charAt(0) == '-')
              cc = false;
            if(access.charAt(1) == 'u')
              uu = true;
            else if(access.charAt(1) == '-')
              uu = false;
            if(access.charAt(2) == 'v')
              vv = true;
            else if(access.charAt(2) == '-')
              vv = false;
            if(access.charAt(3) == 'e')
              ee = true;
            else if(access.charAt(3) == '-')
              ee = false;
            if(access.charAt(4) == 'd')
              dd = true;
            else if(access.charAt(4) == '-')
              dd = false;


            $$("fmanager").clearAll();
            $$("fmanager").destructor();
            var dat = emptydat;
            if(data.val() != null)
              dat = data.val();
            dat[0].open = true;
            console.log(dat);

            webix.ui({
              view:"filemanager",
              data: dat,
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
            if(vv) {
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
            }

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
              if(!uu) return false;
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
                //alert("Upload Succeed");
                var userid = $scope.getCurrentUID();
                firebase.database().ref('/jobs/' + $scope.jobname + '/' + userid).update({lastfileid : response.id});
                firebase.database().ref('/user-jobs/' + userid + '/' + $scope.jobname).update({lastfileid : response.id});
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

            $$("fmanager").attachEvent("onBeforeCreateFolder",function(id){
                return cc;
            });
            $$("fmanager").attachEvent("onBeforeUploadDialog",function(file_config){
                return uu;
            });
            $$("fmanager").attachEvent("onBeforeDrag",function(context,ev){
                return ee;
            });
            $$("fmanager").attachEvent("onBeforeEditFile",function(id,state,editor,view){
                return ee;
            });
            $$("fmanager").attachEvent("onBeforeMarkCut", function(ids){
                return ee;
            });
            $$("fmanager").attachEvent("onBeforeMarkCopy", function(ids){
                return ee;
            });
            $$("fmanager").attachEvent("onBeforeDeleteFile", function(id){
                return dd;
            });


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

var doUpload = function() {
  var pathary = $$("fmanager").getPath();
  $$("fmanager").uploadFile(pathary[pathary.length-1]);
}
