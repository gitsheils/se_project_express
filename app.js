const express = require("express");

const app = express();

const mongoose = require("mongoose");

app.listen(3001, () => {
  console.log(`App listening at port 3001`);
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "6633f57f248e722ef36a98d8", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use("/", require("./routes/index"));
