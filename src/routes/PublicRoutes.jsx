import Forbidden from "../pages/Forbidden";
import ForgotPassword from "../pages/ForgotPassword";
import InternalServerError from "../pages/InternalServerError";
import NotFound from "../pages/NotFound";
import ServiceUnavailable from "../pages/ServiceUnavailable";
import VerifyAccount from "../pages/VerifyAccount";
import Signin2 from "../pages/auth/Signin2";

const publicRoutes = [
  // { path: "", element: <Signin2 /> },
  // { path: "/", element: <Signin2 /> },
  { path: "login", element: <Signin2 /> },
  // { path: "verify-account", element: <VerifyAccount /> },
  // { path: "forgot-password", element: <ForgotPassword /> },
  { path: "not-found", element: <NotFound /> },
  { path: "pages/error-500", element: <InternalServerError /> },
  { path: "pages/error-503", element: <ServiceUnavailable /> },
  { path: "pages/error-505", element: <Forbidden /> },
];

export default publicRoutes;
