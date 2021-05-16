var pool = require("./config");
const { isEmail, isNumber } = require("node-simple-validator");

module.exports.ADD_EMAIL = async (req, res) => {
  try {
    const { pincode, email, age } = req.body;
    if (pincode && email&&age) {
      if (isEmail(email)) {
        if (isNumber(parseInt(pincode))) {
          var [result] = await pool.query(
            "Select * FROM `users` WHERE email=? AND pincode=? AND age=?",
            [email, pincode,age]
          );
          if (!result) {
            await pool.query(
              "INSERT INTO `users`(`email`, `pincode`,`age`) VALUES (?,?,?)",
              [email, pincode, age]
            );
            res.json({ body: "Email Added", status: 1 });
            var [result2] = await pool.query(
              "Select * FROM `area` WHERE pincode=?",
              [pincode]
            );
            if (!result2) {
              pool.query("INSERT INTO `area`(`pincode`) VALUES (?)", [pincode]);
            }
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
          var [result] = await pool.query(
            "Select * FROM `users` WHERE email=? AND pincode=?",
            [email, pincode]
          );
          if (result) {
            await pool.query(
              "DELETE FROM `users` WHERE email=? AND pincode=? ",
              [email, pincode]
            );
            res.json({ body: "Email Deleted", status: 1 });
            var [result2] = await pool.query(
              "Select * FROM `users` WHERE pincode=?",
              [pincode]
            );
            if (!result2) {
              pool.query("DELETE FROM `area` WHERE pincode=?", [pincode]);
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
