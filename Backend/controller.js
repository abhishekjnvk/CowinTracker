const queryDB = require("./config");
const { isEmail, isNumber } = require("node-simple-validator");
const helper = require("./helper");
const cache = require('memory-cache');

module.exports.ADD_EMAIL = async (req, res) => {
  try {
    const { pincode, email, age } = req.body;
    if (pincode && email && age) {
      if (isEmail(email)) {
        if (isNumber(parseInt(pincode))) {
          var [result] = await queryDB(
            "Select * FROM `users` WHERE email=? AND pincode=? AND age=?",
            [email, pincode, age]
          );
          if (!result) {
            var ab = await queryDB(
              "INSERT INTO `users`(`email`, `pincode`,`age`) VALUES (?,?,?)",
              [email, pincode, age]
            );

            var [result2] = await queryDB(
              "Select * FROM `area` WHERE pincode=?",
              [pincode]
            );
            if (!result2) {
              queryDB("INSERT INTO `area`(`pincode`) VALUES (?)", [pincode]);
              var [result3] = await queryDB(
                "Select id FROM `area` WHERE pincode=?",
                [pincode]
              );
              let id = result3.id;
              // Adding Newly added pincode in interval search
              cache.put("cache_" + pincode, 1);
              helper.search(pincode, id, true);
              setInterval(() => {
                //searching after each 30 minutes
                helper.search(pincode, id, true);
              }, 1800 * 1000);
            }
            res.json({ body: "Email Added", status: 1, ab });
          } else {
            res.json({ status: 0, message: "Already Added" });
          }
        } else {
          res.json({ status: 0, message: "Invalid Pincode" });
        }
      } else {
        res.json({ status: 0, message: "Invalid Email" });
      }
    }
  } catch (err) {
    res.status(500).json({
      path: "Internal Server Error",
      message: err.message,
      status: 0,
    });
  }
};

module.exports.REMOVE_EMAIL = async (req, res) => {
  try {
    const { pincode, email } = req.body;
    if (pincode && email) {
      if (isEmail(email)) {
        if (isNumber(parseInt(pincode))) {
          var [result] = await queryDB(
            "Select * FROM `users` WHERE email=? AND pincode=?",
            [email, pincode]
          );
          if (result) {
            await queryDB("DELETE FROM `users` WHERE email=? AND pincode=? ", [
              email,
              pincode,
            ]);
            res.json({ body: "Email Deleted", status: 1 });
            var [result2] = await queryDB(
              "Select * FROM `users` WHERE pincode=?",
              [pincode]
            );
            if (!result2) {
              queryDB("DELETE FROM `area` WHERE pincode=?", [pincode]);
              cache.del("cache_" + pincode);
            }
          } else {
            res.json({ status: 0, message: "Email Doesn't Exist" });
          }
        } else {
          res.json({ status: 0, message: "Invalid Pincode" });
        }
      } else {
        res.json({ status: 0, message: "Invalid Email" });
      }
    }
  } catch (err) {
    res.status(500).json({
      path: "Internal Server Error",
      message: err.message,
      status: 0,
    });
  }
};
