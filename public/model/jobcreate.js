var config = {
  apiKey: "AIzaSyDHCYxT4Ad9L5Yj8EBvlnGWMDoyTnu1p4k",
  authDomain: "unibuilder-239ff.firebaseapp.com",
  databaseURL: "https://unibuilder-239ff.firebaseio.com",
  projectId: "unibuilder-239ff",
  storageBucket: "unibuilder-239ff.appspot.com",
  messagingSenderId: "820435656999"
};
var secondaryApp = firebase.initializeApp(config, "Secondary");

function writeNewJob(uid, firstname, lastname, email, jobname, status, jtype, pmg, notify, grplist, jgrp, jpre,
   address, lot, city, state, zip, permit, price,
   pstart, astart, pcom, acom, wdays, jcolor,
   internal, sub, access,
   ownerName, ownerEmail, ownerPw,owneraddress, ownercity, ownerstate, ownerzip, ownerphone, ownercellphone,
   internalusers, subs) {
  // A post entry.
  var postData = {
    uid: uid,
    fname: firstname,
    lname: lastname,
    email: email,
    jobname: jobname,
    status: status,
    jobtype: jtype,
    projmgr: pmg,
    notify: notify,
    jobgrouplist: grplist,
    jobgroup: jgrp,
    jobprefix: jpre,
    address: address,
    lotinfo: lot,
    city: city,
    state: state,
    zip: zip,
    permit: permit,
    price: price,
    pstart: pstart,
    astart: astart,
    pcom: pcom,
    acom: acom,
    workdays:wdays,
    jobcolor: jcolor,
    internal:internal,
    sub:sub,
    access:access
  };

  var createData = {
    creatorID : uid
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('jobs').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/jobs/' + newPostKey + '/' + uid] = postData;
  updates['/user-jobs/' + uid + '/' + newPostKey] = postData;
  updates['/joblist/' + newPostKey] = createData;

  //if(hasOwner) {
    var ownerData = {
      access:"----",
      email: ownerEmail,
      name: ownerName,
      address: owneraddress,
      city: ownercity,
      state: ownerstate,
      zip: ownerzip,
      phone: ownerphone,
      cellphone: ownercellphone
    }

    secondaryApp.auth().createUserWithEmailAndPassword(ownerEmail, ownerPw).then(function(result) {
        firebase.database().ref('users/' + result.uid).set({
          email: ownerEmail,
          type: "owner"
        });
        var ownerid = result.uid;
        firebase.database().ref('/jobs/' + newPostKey + '/' + ownerid).set(ownerData);
        firebase.database().ref('/user-jobs/' + ownerid + '/' + newPostKey).set(ownerData);

//        updates['/jobs/' + newPostKey + '/' + ownerid] = ownerData;
//        updates['/user-jobs/' + ownerid + '/' + newPostKey] = ownerData;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if(errorCode == 'auth/invalid-email') {
        alert(email + ' is not a valid email address.')
      } else if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      }
      console.log(error);
    });
  //}
  console.log(updates);

  for(var i=0; i<internalusers.length; i++) {
    var internalData = {
      access:"----",
      viewing:internalusers[i].viewing,
      notification:internalusers[i].notification
    }

    updates['/jobs/' + newPostKey + '/' + internalusers[i].key] = internalData;
    updates['/user-jobs/' + internalusers[i].key + '/' + newPostKey] = internalData;
  }

  for(var i=0; i<subs.length; i++) {
    var subData = {
      access:"----",
      viewing:subs[i].viewing
    }

    updates['/jobs/' + newPostKey + '/' + subs[i].key] = subData;
    updates['/user-jobs/' + subs[i].key + '/' + newPostKey] = subData;
  }

  return firebase.database().ref().update(updates);
}
