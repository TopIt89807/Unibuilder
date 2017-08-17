function writeNewJob(uid, firstname, lastname, email, jobname, status, jtype, pmg, notify, grplist, jgrp, jpre,
   address, lot, city, state, zip, permit, price,
   pstart, astart, pcom, acom, wdays, jcolor,
  internal, sub) {
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
    sub:sub
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('jobs').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/jobs/' + newPostKey] = postData;
  updates['/user-jobs/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
