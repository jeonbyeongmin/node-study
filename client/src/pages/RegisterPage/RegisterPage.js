import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import useUserActions from "../../common/hooks/useUserActions";

function RegisterPage() {
  const navigator = useNavigate();
  const userActions = useUserActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else if (name === "email") setEmail(value);
    else if (name === "confirmPw") setConfirmPw(value);
    else if (name === "pw") setPassword(value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPw) {
      return alert("비밀번호 확인");
    }
    userActions
      .register(name, email, password)
      .then((user) => (user.loginSuccess ? navigator("/") : ""));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>name</label>
        <input
          type="text"
          value={name}
          name="name"
          onChange={onChangeHandler}
        />
        <label>email</label>
        <input
          type="email"
          value={email}
          name="email"
          onChange={onChangeHandler}
        />

        <label>password</label>
        <input
          type="password"
          value={password}
          name="pw"
          onChange={onChangeHandler}
        />

        <label>confirm password</label>
        <input
          type="password"
          value={confirmPw}
          name="confirmPw"
          onChange={onChangeHandler}
        />

        <br />
        <button>회원가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
