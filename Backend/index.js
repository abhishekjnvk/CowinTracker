require("dotenv/config");
const helper = require("./helper");
const moment = require("moment");
const express = require("express");
const { ADD_EMAIL, REMOVE_EMAIL } = require("./controller");
const app = express();
const PORT = process.env.PORT || 3030;
app.use(express.urlencoded({ extended: true }));
var center_list = [];
var week_count = [];

var Search = async (pincode, date, id, start = false) => {
  try {
    if (start) {
      week_count[id] = 1;
      center_list[id] = [];
      var date = moment().format("DD-MM-YYYY"); //date format accepted by cowin
    }
    var log = await helper.scan(pincode, date);
    if (log.centers.length) {
      center_list[id].push(log.centers);
      date = moment()
        .add(7 * week_count[id], "days")
        .format("DD-MM-YYYY");
      week_count[id]++;
      Search(pincode, date); //checking all available data
    } else {
      helper.analyse(center_list[id]); // Analyzing data for age group and dose
    }
  } catch (err) {
    console.log(err);
  }
};

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/Frontend/index.html");
});

app.post("/add", ADD_EMAIL);
app.post("/remove", REMOVE_EMAIL);

app.listen(PORT, async () => {
  let results = await helper.getPinCodes();
  results.map((elements) => {
    console.log(elements.pincode);
    Search(elements.pincode, elements.id, true);
    setInterval(() => {
      //searching after each 30 minutes
      Search(pincode, elements.id, true);
    }, 1800 * 1000);
  });
  console.log("SERVER STARTED AT PORT " + PORT);
});
