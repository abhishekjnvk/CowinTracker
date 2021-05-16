const request = require("request");
const queryDB = require("./config");
const moment = require("moment");
const cache = require('memory-cache');

var center_list = [];
var week_count = [];

var helper = {
  scan: async (pincode, date) => {
    var options = {
      method: "GET",
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`,
      headers: {},
    };
    return new Promise(function (resolve, reject) {
      request(options, function (error, response) {
        if (error) console.log(error);
        else {
          if (response.statusCode == 200) {
            var response_data = JSON.parse(response.body);
            resolve(response_data);
          } else {
            reject(response.statusCode);
          }
        }
      });
    });
  },
  analyse: async (centers) => {
    var final_available18 = 0;
    var final_available45 = 0;
    var final_available45 = 0;
    var final_available45 = 0;
    var dose_1_45 = 0;
    var dose_2_45 = 0;
    var dose_1_18 = 0;
    var dose_2_18 = 0;
    var upto_date = "";
    centers.map((center_list) => {
      center_list.map((center) => {
        let total_slot = center.sessions;
        total_slot.map((slot) => {
          upto_date = slot.date;
          var age_limit = slot.min_age_limit;
          if (age_limit == 18) {
            final_available18 = final_available18 + slot.available_capacity;
            dose_1_18 = dose_1_18 + slot.available_capacity_dose1;
            dose_2_18 = dose_2_18 + slot.available_capacity_dose2;
          }
          if (age_limit == 45) {
            dose_1_45 = dose_1_45 + slot.available_capacity_dose1;
            dose_2_45 = dose_2_45 + slot.available_capacity_dose2;
            final_available45 = final_available45 + slot.available_capacity;
          }
        });
      });
    });
    console.log("Available slots in your area");
    console.log([
      {
        age: 18,
        total: final_available18,
        dose1: dose_1_18,
        dose2: dose_2_18,
        data_upto: upto_date,
      },
      {
        age: 45,
        total: final_available45,
        dose1: dose_1_45,
        dose2: dose_2_45,
        data_upto: upto_date,
      },
    ]);
  },
  search: async (pincode, id, start = false) => {
    try {
      if (cache.get("cache_" + pincode)) {
        if (start) {
          week_count[id] = 1;
          center_list[id] = [];
          var date = moment().format("DD-MM-YYYY"); //date format accepted by cowin
        } else {
          date = moment()
            .add(6 * week_count[id], "days")
            .format("DD-MM-YYYY");
          week_count[id]++;
        }
        var log = await helper.scan(pincode, date);
        if (log.centers.length) {
          console.log("Scanning for" + date);
          center_list[id].push(log.centers);
          helper.search(pincode, id); //checking all available data
        } else {
          console.log("Done Scanning" + date);
          if (center_list[id]) helper.analyse(center_list[id]); // Analyzing data for age group and dose
        }
      } else {
        console.log("Cache Deleted");
      }
    } catch (err) {
      console.log(err);
    }
  },
  sendMail() {}, //: Todo
  getPinCodes: async () => {
    await queryDB(
      `CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY AUTOINCREMENT,pincode integer,email varchar,age integer)`
    );
    await queryDB(
      `CREATE TABLE IF NOT EXISTS area (id integer PRIMARY KEY AUTOINCREMENT,pincode integer)`
    );
    var results = await queryDB("SELECT * from area");
    return results;
  },
};

module.exports = helper;
