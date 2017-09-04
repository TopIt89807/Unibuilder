function updateJob(uid, jobkey, firstname, lastname, email, jobname, status, jtype, pmg, notify, grplist, jgrp, jpre,
   address, lot, city, state, zip, permit, price,
   pstart, astart, pcom, acom, wdays, jcolor,
  internal, sub, mapped, lat, lng, access) {
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
    mapped: mapped,
    lat: lat,
    lng: lng,
    access: access
  };

  var updates = {};
  updates['/jobs/' + jobkey + '/' + uid] = postData;
  updates['/user-jobs/' + uid + '/' + jobkey] = postData;

  return firebase.database().ref().update(updates);
}
