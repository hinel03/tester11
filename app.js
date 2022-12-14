const express = require('express');
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index")
require("dotenv").config();
const app = express();


//db연결
const connect = require("./schemas");
connect();

app.use(cookieParser);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", indexRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message :"메인화면" });
});

module.exports = app;

app.listen(4000, () => {
    console.log(4000, '포트로 서버가 열렸어요!');
  });

