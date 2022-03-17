import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useUserActions from "../../common/hooks/useUserActions";

export default function AuthHoc(SpecificComponent, option, adminRoute = null) {
  const userActions = useUserActions();

  function AuthenticationCheck() {
    const navigator = useNavigate();
    useEffect(() => {
      userActions.auth().then((res) => {
        if (!res.isAuth && option) {
          navigator("/login");
        } else if (res.isAuth && !option) {
          navigator("/");
        }
      });
    }, [navigator]);

    return <SpecificComponent />;
  }

  return <AuthenticationCheck />;
}
