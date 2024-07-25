import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import userAvatar from "../assets/img/img1.jpg";
import { Col, Image, Row } from "react-bootstrap";
import { Button } from "reactstrap";
import { dashboardMenu } from "../data/Menu";
import { useGetUser } from "../hooks/useAuth";
import UptGrup from "../assets/json/uptNewGrouping.json"
import toast from "react-hot-toast";

const Header = (args, { onSkin }) => {
  function getUptDetil(e) {
    let retur = UptGrup.filter(item => item.id == e)
    return retur[0]
  }
  const user = useGetUser();
  // eslint-disable-next-line react/display-name
  const CustomToggle = React.forwardRef(function ({ children, onClick }, ref) {
    return (
      <Link
        to=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className="dropdown-link"
      >
        {children}
      </Link>
    );
  });

  const skinMode = (e) => {
    e.preventDefault();
    e.target.classList.add("active");

    let node = e.target.parentNode.firstChild;
    while (node) {
      if (node !== e.target && node.nodeType === Node.ELEMENT_NODE)
        node.classList.remove("active");
      node = node.nextElementSibling || node.nextSibling;
    }

    let skin = e.target.textContent.toLowerCase();
    let HTMLTag = document.querySelector("html");

    if (skin === "dark") {
      HTMLTag.setAttribute("data-skin", skin);
      localStorage.setItem("skin-mode", skin);

      onSkin(skin);
    } else {
      HTMLTag.removeAttribute("data-skin");
      localStorage.removeItem("skin-mode");

      onSkin("");
    }
  };

  const sidebarSkin = (e) => {
    e.preventDefault();
    e.target.classList.add("active");

    let node = e.target.parentNode.firstChild;
    while (node) {
      if (node !== e.target && node.nodeType === Node.ELEMENT_NODE)
        node.classList.remove("active");
      node = node.nextElementSibling || node.nextSibling;
    }

    let skin = e.target.textContent.toLowerCase();
    let HTMLTag = document.querySelector("html");

    HTMLTag.removeAttribute("data-sidebar");

    if (skin !== "default") {
      HTMLTag.setAttribute("data-sidebar", skin);
      localStorage.setItem("sidebar-skin", skin);
    } else {
      localStorage.removeItem("sidebar-skin", skin);
    }
  };
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.clear();
    toast.success("Berhasil logout")
    navigate("/login");
  };
  const { pathname } = useLocation();
  console.log(user)
  
  return (
    <div className="w-100">
      <div className="header-main mx-3 mx-lg-4">
        <div className="sidebar-header" style={{ columnGap: 5 }}>
          <Image src="/logo.png" width={50} height={50} />
          <div className="d-flex flex-column">
            <h5 className="fw-bold m-0">PNBP</h5>
            <h5 className="fw-bold m-0"> Barantin</h5>
          </div>
        </div>
        <div className="vr my-2 m-2"></div>
        <div className="h-200">
          <div className="d-flex h-100 align-items-center">
            {dashboardMenu?.map((item, idx) => {
              const active =
                pathname == item.link
                  ? "bg-warning h-80 d-inline-block"
                  : "";
              return (
                <div key={idx} className={active}>
                  <Link className={"px-3 text-dark fw-bold"} key={idx} to={item?.link}>
                    {item?.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="vr my-2 m-2"></div>
        <div className="me-auto ">
          <h5>UPT Induk</h5>
          <h6>{getUptDetil(user?.upt)?.nama}</h6>
        </div>
        <Dropdown className="dropdown-skin" align="end">
          <Dropdown.Menu className="mt-10-f">
            <label>Skin Mode</label>
            <nav className="nav nav-skin">
              <Link
                onClick={skinMode}
                className={
                  localStorage.getItem("skin-mode")
                    ? "nav-link"
                    : "nav-link active"
                }
              >
                Light
              </Link>
              <Link
                className={
                  localStorage.getItem("skin-mode")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Dark
              </Link>
            </nav>
            <hr />
            <label>Sidebar Skin</label>
            <nav id="sidebarSkin" className="nav nav-skin">
              <Link
                onClick={sidebarSkin}
                className={
                  !localStorage.getItem("sidebar-skin")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Default
              </Link>

              <Link
                onClick={sidebarSkin}
                className={
                  localStorage.getItem("sidebar-skin") === "dark"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Dark
              </Link>
            </nav>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="dropdown-profile ms-3 ms-xl-4" align="end">
          <Dropdown.Toggle as={CustomToggle}>
            <div className="avatar online">
              <img src={userAvatar} alt="" />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-10-f">
            <div className="dropdown-menu-body">
              <div className="avatar avatar-xl online mb-3">
                <img src={userAvatar} alt="" />
              </div>
              <h5 className="mb-1 text-dark fw-semibold">{user?.name}</h5>
              <p className="fs-sm text-secondary mb-0">{user?.nama}</p>
              <p className="fs-sm text-secondary mb-0">{user?.nip}</p>
              <hr />
              <p className="fs-sm text-secondary">{getUptDetil(user?.upt)?.nama?.replace("Balai Karantina Hewan, Ikan, dan Tumbuhan", "BKHIT")?.replace("Balai Besar Karantina Hewan, Ikan, dan Tumbuhan", "BBKHIT") ?? "-"}</p>

              <nav className="nav"></nav>
              <hr />
              <nav className="nav">
                
                <Button onClick={() => logout()}>
                  <i className="ri-logout-box-r-line"></i> Log Out
                </Button>
              </nav>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
export default Header;
