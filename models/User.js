const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10; // salt를 이용해서 비밀번호 암호화하게 됨. 그 전에 솥트가 몇 글자인지 정해줌

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  // role 을 주는 이유? 관리자, 일반 유저 등
  role: {
    type: Number,
    default: 0,
  },
  image: String,

  // 유효성 관리
  token: {
    type: String,
  },

  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  // 비밀번호 암호화 시키기.
  var user = this;

  // 0. 비밀번호가 변경될 때에만
  if (user.isModified("password")) {
    // 1. salt 만들기

    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      // 2. 암호화된 hash 값 만들기
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken으로 토큰 생성하기

  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // token decode
  jwt.verify(token, "secretToken", function (err, decoded) {
    // find user

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
