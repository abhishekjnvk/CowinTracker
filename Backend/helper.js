var request = require("request");
var queryDB = require("./config");

var self = (module.exports = {
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
});
