var config = {
  apiKey: "AIzaSyDHCYxT4Ad9L5Yj8EBvlnGWMDoyTnu1p4k",
  authDomain: "unibuilder-239ff.firebaseapp.com",
  databaseURL: "https://unibuilder-239ff.firebaseio.com",
  projectId: "unibuilder-239ff",
  storageBucket: "unibuilder-239ff.appspot.com",
  messagingSenderId: "820435656999"
};
var thirdApp = firebase.initializeApp(config, "Third");
app.controller("users", function($scope, $timeout) {

  $scope.gridData = [];

  $scope.ds = new kendo.data.DataSource({
    data:$scope.gridData,
    pageSize:50
  });

  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }

  $scope.gridOptions = {
    columns: [
        {field:"UserKey", hidden:true},
        {field:"Email",encoded: false},
        {field:"Firstname", title:"First Name", encoded: false},
        {field:"Lastname", title:"Last Name"},
        {field:"Type"},
        {field:"CreateAccess", title: "Job Create Access", encoded: false},
        {field:"Other", title:" ", encoded: false}
    ],
    pageable: {
        pageSizes: [20, 50, 75, 100, 250],
        refresh: true,
        buttonCount: 5
    },
    sortable: true,
    resizable: true
  }
  $scope.userc_type = "admin";

  var usersRef = firebase.database().ref('/users/');
  $scope.caccess = [];

  usersRef.on('value', function(data) {
    $scope.gridData = [];
    $scope.caccess = [];
    var keys = [];
    for(var k in data.val()) {
      keys.push(k);
    }
    var cnt = 0;
    for(var i=0; i<keys.length; i++) {
      var ref =  firebase.database().ref('/users/' + keys[i]);
      ref.once('value').then(function(snapshot) {
        var key = snapshot.key;
        var email = snapshot.val().email;
        var fname = snapshot.val().firstname;
        var lname = snapshot.val().lastname;
        var type;
        var cacc = snapshot.val().createaccess;
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

        $scope.caccess.push(cacc);
        var col = {
            UserKey: key,
            Email: email,
            Firstname: fname,
            Lastname: lname,
            Type: type,
            CreateAccess: "<input type='checkbox' ng-model='caccess[" + cnt + "]' ng-change='onCheckCreateAccess(" + cnt + ", \"" + key + "\")'/>",
            Other: "<a type='button' data-toggle='modal' href='users#medium' class='btn btn-sm btn-circle purple btn-outline' ng-click='edit(\"" + key + "\");'>Edit</a>" + "&nbsp" +
                  "<a type='button' class='btn btn-sm btn-circle red btn-outline' ng-click='delete(\"" + key + "\");'>Delete</a>"
        }

        $scope.gridData.push(col);
        $scope.ds = new kendo.data.DataSource({
          data:$scope.gridData,
          pageSize:50
        });

        $scope.$apply();
        cnt ++;
      });
    }
  });

  $scope.onCheckCreateAccess = function($index, key) {
    var ref =  firebase.database().ref('/users/' + key);
    ref.update({createaccess : $scope.caccess[$index]});
  }

  $scope.onCreate = function() {
    var email = $scope.userc_email;
    var fname = $scope.userc_fname;
    var lname = $scope.userc_lname;
    var pw = $scope.userc_password;
    var confpw = $scope.userc_confpw;
    var type = $scope.userc_type;

    if (email == undefined) {
      alert('Please enter an email address.');
      return;
    }

    if(pw != confpw) {
        alert('Confirm password again.');
        return;
    }

    if (pw == undefined) {
      alert('Please enter a password.');
      return;
    }
    thirdApp.auth().createUserWithEmailAndPassword(email, pw).then(function(result) {
        console.log(result);
        var acc;
        switch(type) {
          case "admin":
            acc = true;
            break;
          case "owner":
            acc = false;
            break;
          case "internal":
            acc = false;
            break;
          case "subs":
            acc = false;
            break;
        }
        firebase.database().ref('users/' + result.uid).set({
          email: email,
          firstname: fname,
          lastname: lname,
          type: type,
          createaccess: acc
        });
       $("#createuser").modal('hide')
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if(errorCode == 'auth/invalid-email') {
        alert(email + ' is not a valid email address.')
      } else if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else alert(errorMessage);
      console.log(error);
    });
  }

  $scope.edit = function(key) {
    var ref =  firebase.database().ref('/users/' + key);
    ref.once('value').then(function(snapshot) {
      $scope.user_key = snapshot.key;
      $scope.user_email = snapshot.val().email != undefined? snapshot.val().email : null;
      $scope.user_fname = snapshot.val().firstname!= undefined? snapshot.val().firstname : null;
      $scope.user_lname = snapshot.val().lastname!= undefined? snapshot.val().lastname : null;
      $scope.user_type = snapshot.val().type!= undefined? snapshot.val().type : null;
      $scope.$apply();
    });
  }

  $scope.onSave = function() {
    var key = $scope.user_key;
    var fname = $scope.user_fname;
    var lname = $scope.user_lname;
    var type = $scope.user_type;
    var ref =  firebase.database().ref('/users/' + key);
    ref.update({firstname : fname, lastname : lname, type: type});
  }

  $scope.delete = function(key) {
    bootbox.confirm("Are you sure to delete this user?", function(result) {
      if(result == true) {
        var ref = firebase.database().ref('/users/' + key);
        ref.remove();
      }
    });
  }

});
