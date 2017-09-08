function writeNewJob(uid, firstname, lastname, email, jobname, status, jtype, pmg, notify, grplist, jgrp, jpre,
   address, lot, city, state, zip, permit, price,
   pstart, astart, pcom, acom, wdays, jcolor,
   internal, sub, access,
   hasOnwer, ownerEmail, ownerPw) {
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

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('jobs').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/jobs/' + newPostKey + '/' + uid] = postData;
  updates['/user-jobs/' + uid + '/' + newPostKey] = postData;

  if(hasOwner) {
    var ownerData = {
      access:""
    }
    var ownerid = createUser("owner", ownerEmail, ownerPw);
    updates['/jobs/' + newPostKey + '/' + ownerid] = ownerData;
    updates['/user-jobs/' + ownerid + '/' + newPostKey] = ownerData;
  }

  return firebase.database().ref().update(updates);
}


function createUser(type, email, pw) {
  firebase.auth().createUserWithEmailAndPassword(email, pw).then(function(result) {
      firebase.database().ref('users/' + result.uid).set({
        email: email,
        type: type
      });
      return result.uid;
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
    // [END_EXCLUDE]
  });
  return null;
}
