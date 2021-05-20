$(document).ready(function () {
  $("#proceed").click(function () {
    var email = $("#email").val();
    var pincode = $("#pincode").val();
    var age = $("#age").val();
    if (age && pincode && email) {
      var settings = {
        url: "/add",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          email: email,
          pincode: pincode,
          age: age,
        },
      };

      $.confirm({
        title: "Adding email for alert",
        content: function () {
          var self = this;
          self.setContent("Please wait");
          return $.ajax(settings).done(function (response) {
            // console.log(response);
            if (response.status) {
              self.setContent("Email Added");
              $("#email").val("");
              $("#pincode").val("");
            } else {
              self.setContent(response.message);
            }
          });
        },
        buttons: {
          Okay: {
            btnClass: "btn-blue",
          },
        },
      });
    } else {
      $.alert("Missing Required Field");
    }
  });
  $("#remove").click(function () {
    var email = $("#email_remove").val();
    var pincode = $("#pincode_remove").val();
    if (pincode && email) {
      var settings = {
        url: "/remove",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          email: email,
          pincode: pincode,
        },
      };
      $.confirm({
        title: "Remove Email From List",
        content: function () {
          var self = this;
          self.setContent("Please wait");
          return $.ajax(settings).done(function (response) {
            // console.log(response);
            if (response.status) {
              self.setContent("Email Removed From list");
              $("#email_remove").val("");
              $("#pincode_remove").val("");
            } else {
              self.setContent(response.message);
              // $.alert(response.message);
            }
          });
        },
        buttons: {
          Okay: {
            btnClass: "btn-blue",
          },
        },
      });
    } else {
      $.alert("Missing Required Field");
    }
  });
});
