import Kuitansi from "../pages/Kuitansi";
import KuitansiDetail from "../pages/KuitansiDetail";
import Payment from "../pages/Payment";
import PaymentAdd from "../pages/PaymentCreate";
import PaymentDetail from "../pages/PaymentDetail";
import PaymentDocument from "../pages/PaymentDocument";
import PaymentEdit from "../pages/PaymentEdit";
import PermohonanBilling from "../pages/req-bill/PermohonanBilling";
import QuarantineTree from "../pages/QuarantineTree";
import UserCreate from "../pages/UserCreate";
import UserManager from "../pages/UserManager";
// import Profile from "../pages/auth/Profile";
import Certificate from "../pages/certificate/Certificate";
import KuitansiCreate from "../pages/kuitansi/KuitansiCreate";
import KuitansiEdit from "../pages/kuitansi/KuitansiEdit";

const protectedRoutes = [
  { path: "/", element: <Certificate /> },
  { path: "payment", element: <Payment /> },
  { path: "payment/:id/create", element: <PaymentAdd /> },
  { path: "payment/:id/detail", element: <PaymentDetail /> },
  { path: "payment/:id/edit", element: <PaymentEdit /> },
  { path: "permohonan-billing", element: <PermohonanBilling /> },
  { path: "kuitansi", element: <Kuitansi /> },
  { path: "kuitansi/:idData/create", element: <KuitansiCreate /> },
  { path: "kuitansi/:idData/detail", element: <KuitansiDetail /> },
  { path: "kuitansi/:idData/edit", element: <KuitansiEdit /> },
  { path: "user-manager", element: <UserManager /> },
  { path: "user-manager/create", element: <UserCreate /> },
  { path: "tree", element: <QuarantineTree /> },
  { path: "status", element: <PaymentDocument /> },
  // { path: "profile", element: <Profile /> },
];

export default protectedRoutes;
