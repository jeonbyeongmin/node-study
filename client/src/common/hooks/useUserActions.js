// 비동기 비즈니스 로직들을 hook으로 따로 빼면 컴포넌트가 가벼워지고 무엇보다 팀 개발의 생산성이 크게 올라감.

import axios from "axios";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../../states/auth";

export default function useUserActions() {
  const setAuth = useSetRecoilState(authAtom);

  return {
    login,
    logout,
    register,
    auth,
  };

  async function login(email, password) {
    try {
      const user = await axios.post("/api/user/login", { email, password });
      const { accessToken } = user.data;
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      return user.data;
    } catch (e) {
      return e.response;
    }
  }

  async function logout() {
    try {
      const response = await axios.get("/api/user/logout");
      return response.data;
    } catch (e) {
      return e.response;
    }
  }

  async function register(name, email, password) {
    try {
      const response = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        const user = await login(email, password);
        return user;
      } else {
        return response.data;
      }
    } catch (e) {
      return e.response;
    }
  }

  async function auth() {
    try {
      const user = await axios.get("/api/user/auth");

      console.log(user.data);
      setAuth(user.data);
      return user.data;
    } catch (e) {
      return e.response;
    }
  }
}
