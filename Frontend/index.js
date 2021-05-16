$(document).ready(function () {
  $("#proceed").click(function () {
    console.log("Onclick");
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
      $.ajax(settings).done(function (response) {
        console.log(response);
        if (response.status) {
          alert("Email Added In list");
          $("#email").val("");
          $("#pincode").val("");
        } else {
          alert(response.message);
        }
      });
    } else {
      console.log("Missing Required Field");
    }
  });
});
