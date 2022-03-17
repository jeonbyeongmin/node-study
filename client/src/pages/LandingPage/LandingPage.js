import React from "react";
import useUserActions from "../../common/hooks/useUserActions";

import { Link, useNavigate } from "react-router-dom";

function LandingPage() {
  const userActions = useUserActions();
  const navigator = useNavigate();

  const conClickHandler = async () => {
    const response = await userActions.logout();
    if (response?.success) navigator("/login");
  };

  return (
    <div>
      <Link to="/login">login</Link>

      <button onClick={conClickHandler}>logout</button>
    </div>
  );
}

export default LandingPage;
