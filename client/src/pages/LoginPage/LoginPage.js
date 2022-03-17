import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import useUserActions from "../../common/hooks/useUserActions";

function LoginPage() {
  const navigator = useNavigate();
  const userActions = useUserActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "pw") setPassword(value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    userActions
      .login(email, password)
      .then((user) => (user.loginSuccess ? navigator("/") : null));
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

        <br />
        <button>login</button>
      </form>
    </div>
  );
}

export default LoginPage;
