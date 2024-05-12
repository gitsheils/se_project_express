const express = require("express");

const app = express();

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

app.listen(3001, () => {
  console.log(`App listening at port 3001`);
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use(express.json());

app.use(cors());
/*
app.use((req, res, next) => {
  req.user = {
    _id: "6633f57f248e722ef36a98d8",
  };
  next();
});
*/

app.use("/", require("./routes/index"));
