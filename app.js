const express = require("express");

const app = express();

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const errorHandler = require("./middleware/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");

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
app.use(requestLogger);

//for code review purposes. remove after code review
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", require("./routes/index"));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
