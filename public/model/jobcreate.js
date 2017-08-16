function writeNewJob(uid, firstname, lastname, email, jobname) {
  // A post entry.
  var postData = {
    uid: uid,
    fname: firstname,
    lname: lastname,
    email: email,
    jobname: jobname
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('jobs').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/jobs/' + newPostKey] = postData;
  updates['/user-jobs/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
