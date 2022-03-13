const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
const config = require("./config/key");

const { User } = require("./models/User");

// body parser가 클라이언트에서 오늘 정보를 분석하는 것인데
// application/x-www-form-urlencoded 이런 데이터를 분석할 수 있게 해주는 것.
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입으로 분석해서 가져올 수 있게 해주는 것.
app.use(bodyParser.json());

const mongoose = require("mongoose");

mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// 이런걸 라우터라고 부름
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
