const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");

const { User } = require("./models/User");

// body parser가 클라이언트에서 오늘 정보를 분석하는 것인데
// application/x-www-form-urlencoded 이런 데이터를 분석할 수 있게 해주는 것.
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입으로 분석해서 가져올 수 있게 해주는 것.
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");

mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// 이런걸 라우터라고 부름
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", (req, res) => {
  res.send("hello~~~");
});

app.post("/api/user/register", (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/api/user/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일을 확인해주세요.",
      });
    }

    // 디비에 있다면 비밀번호가 같은지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }

      // 비밀번호까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 토큰을 어디에 저장하는가?? 쿠키, 로컬스토리지..
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// auth라는 미들웨어가 개입.
app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

const port = 4000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
