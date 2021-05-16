var helper = require("./helper");
var moment = require("moment");
var date = moment().format("DD-MM-YYYY"); //date format accepted by cowin
var pincode = 813103; //pincode of area

var center_list = [];
var week_count = 1;
var Search = async (pincode, date) => {
  var log = await helper.scan(pincode, date);
  if (log.centers.length) {
    center_list.push(log.centers);
    date = moment()
      .add(7 * week_count, "days")
      .format("DD-MM-YYYY");
    week_count++;
    Search(pincode, date); //checking all available data
  } else {
    helper.analyse(center_list); // Analyzing data for age group and dose
  }
};

Search(pincode, date);
setInterval(() => {
  //searching after each 30 minutes
  Search(pincode, date);
}, 1800 * 1000);
