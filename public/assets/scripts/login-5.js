var Login = function() {

    var handleLogin = function() {

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                email: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                email: {
                    required: "Email is required."
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                form.submit(); // form validation success, call ajax form submit
            }
        });

        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                $('#signin-btn').click();
                /*if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;*/
            }
        });

        $('.forget-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        $('#forget-password').click(function(){
            $('.login-form').hide();
            $('.forget-form').show();
            $('.create-form').hide();
            $('.signup-form').hide();
        });

        $('#forgot-back-btn').click(function(){
            $('.login-form').show();
            $('.forget-form').hide();
            $('.create-form').show();
            $('.signup-form').hide();
        });

        $('#signup-back-btn').click(function(){
            $('.login-form').show();
            $('.forget-form').hide();
            $('.create-form').show();
            $('.signup-form').hide();
        });

        $('#register-btn').click(function() {
            $('.login-form').hide();
            $('.forget-form').hide();
            $('.create-form').hide();
            $('.signup-form').show();
        });

        $('#signup-btn').click(function() {
            handleSignUp();
        })

        $('#signin-btn').click(function() {
            toggleSignIn();
        })
    }

    var handleSignUp = function() {
      var email = $('#signup-email').val();
      var newPW = $('#signup-NewPW').val();
      var confirmPW = $('#signup-ConfirmPW').val();

      if (email == '') {
        alert('Please enter an email address.');
        return;
      }

      if(newPW != confirmPW) {
          alert('Confirm password again.');
          return;
      }

      if (newPW.length == 0) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
      firebase.auth().createUserWithEmailAndPassword(email, confirmPW).then(function(result) {
          console.log(result);
          firebase.database().ref('users/' + result.uid).set({
            firstname: $('#signup-fname').val(),
            lastname: $('#signup-lname').val(),
            email: email
          });
          alert("Sign up success");
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
      // [END createwithemail]
    }

    var toggleSignIn = function() {
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        var email = $('#email').val();
        var password = $('#password').val();

        if (email == '') {
          $('.alert-danger', $('.login-form')).text("Please enter an email address.");
          $('.alert-danger', $('.login-form')).show();
          return;
        }

        if (password.length == 0) {
          $('.alert-danger', $('.login-form')).text("Please enter a password.");
          $('.alert-danger', $('.login-form')).show();
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
            //alert("Log In Success");
            $('.alert-danger', $('.login-form')).text("Success");
            $('.alert-danger', $('.login-form')).addClass("alert-success");
            $('.alert-danger', $('.login-form')).removeClass("alert-danger");
            $('.alert-success', $('.login-form')).show();

            Pace.restart();
            Pace.on('hide', function(){
              window.location.href = "../../dashboard.html";
              console.log('done');
            });
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode == 'auth/invalid-email') {
            $('.alert-danger', $('.login-form')).text(email + " is not a valid email address.");
          } else if (errorCode == 'auth/user-not-found') {
            $('.alert-danger', $('.login-form')).text("Email not found");
          } else if (errorCode == 'auth/wrong-password') {
            $('.alert-danger', $('.login-form')).text("Wrong Password");
          }
          $('.alert-danger', $('.login-form')).show();
          console.log(error);
          //document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
      //document.getElementById('quickstart-sign-in').disabled = true;
    }





    return {
        //main function to initiate the module
        init: function() {

            handleLogin();
            // init background slide images
            $('.login-bg').backstretch([
                "../assets/images/login/bg1.jpg",
                "../assets/images/login/bg2.jpg",
                "../assets/images/login/bg3.jpg"
                ], {
                  fade: 1000,
                  duration: 8000
                }
            );

            $('.forget-form').hide();
            $('.create-form').show();
            $('.signup-form').hide();

        }

    };

}();

jQuery(document).ready(function() {
    Login.init();
});
