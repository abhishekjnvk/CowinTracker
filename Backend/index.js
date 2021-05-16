require("dotenv/config");
const path = require("path");
const express = require("express");
const cache = require("memory-cache");
const helper = require("./helper");
const { ADD_EMAIL, REMOVE_EMAIL } = require("./controller");
const app = express();
const PORT = process.env.PORT || 3030;
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.post("/add", ADD_EMAIL);
app.post("/remove", REMOVE_EMAIL);

app.listen(PORT, async () => {
  // let results = await helper.getPinCodes();
  // results.map((elements) => {
  //   cache.put("cache_"+elements.pincode,1)
  //   helper.search(elements.pincode, elements.id, true);
  //   setInterval(() => {
  //     //searching after each 30 minutes
  //     helper.search(elements.pincode, elements.id, true);
  //   }, 1800 * 1000);
  // });
  console.log("SERVER STARTED AT PORT " + PORT);
});
