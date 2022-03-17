import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Auth from "./components/hoc/auth";
import { lazy, Suspense } from "react";

function App() {
  const Landing = lazy(() => import("./pages/LandingPage/LandingPage"));
  const Login = lazy(() => import("./pages/LoginPage/LoginPage"));
  const Register = lazy(() => import("./pages/RegisterPage/RegisterPage"));

  return (
    <Router>
      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          <Route path="/" element={Auth(Landing, null, true)} />
          <Route path="/login" element={Auth(Login, false)} />
          <Route path="/register" element={Auth(Register, false)} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
