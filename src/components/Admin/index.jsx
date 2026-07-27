import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import SettingsIcon from "@mui/icons-material/Settings";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useDispatch, useSelector } from "react-redux";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSnackbar } from "notistack";
import LogoutIcon from "@mui/icons-material/Logout";
import { fetchCurrentUser, logoutAccount } from "../../auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";

export default function AdminDarboard() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  const roles = useSelector((state) => state.authReducer.roles_x01);
  const sessionValid = useSelector((state) => state.authReducer.sessionValid);
  const sessionChecked = useSelector((state) => state.authReducer.sessionChecked);
  const userState = useSelector((state) => state.authReducer);

  const [state, setState] = useState(false);
  const [checking, setChecking] = useState(!sessionChecked);

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (sessionChecked && sessionValid) {
        setChecking(false);
        return;
      }
      try {
        await dispatch(fetchCurrentUser()).unwrap();
      } catch (_) {
        // redirect handled below via sessionValid
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    verifySession();
    return () => {
      cancelled = true;
    };
  }, [dispatch, sessionChecked, sessionValid]);

  if (checking || !sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Đang xác thực phiên đăng nhập...</p>
      </div>
    );
  }

  if (!sessionValid || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutAccount());
      unwrapResult(resultAction);
      enqueueSnackbar("Đăng xuất tài khoản thành công!", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Lỗi khi đăng xuất tài khoản", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
      navigate("/login");
    }
  };

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(!state);
  };

  let activeStyle = {
    textDecoration: "underline",
    fontWeight: "bold",
    color: "grey",
  };

  return (
    <div className="bg-gray-300">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <img src="/cong-an-hieu.png" className="w-[50px] ml-0 md:ml-2" />

            <p className="flex-grow">
              <span className="md:inline text-[7px] md:text-[14px] hidden uppercase">
                Tuyên truyền, đánh giá nhận thức pháp luật về Trật tự an toàn
                giao thông
              </span>
              <span className="md:hidden text-[12px] md:text-[14px] uppercase">
                Cục cảnh sát giao thông - Bộ công an
              </span>
            </p>

            <div className="hidden md:items-center md:space-x-2 md:flex">
              <AccountCircleIcon fontSize="large" />
              <p className="md:text-xl text:md">{userState.user}</p>
            </div>
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer anchor={"left"} open={state} onClose={toggleDrawer(false)}>
        <div className="min-w-[300px] p-4 mt-2">
          <div className="flex items-center space-x-2">
            <SettingsIcon color="primary" />
            <p className="text-xl text-gray-800 font-bold">
              Menu chức năng hệ thống
            </p>
          </div>
          <hr className="mt-2"></hr>

          <ul className="mt-2 px-4">
            {roles && roles.includes("xem tài khoản") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/quan-ly-tai-khoan"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <div className="flex items-center space-x-2">
                    <ManageAccountsIcon color="primary" />
                    <span>Quản lý tài khoản</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem môn thi") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/quan-ly-mon-thi"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <div className="flex items-center space-x-2">
                    <LocalPoliceIcon color="primary" />
                    <span>Quản lý kiến thức đánh giá</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem môn thi") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/mon-thi/chuyen-de"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <div className="flex items-center space-x-2">
                    <LocalPoliceIcon color="primary" />
                    <span>Quản lý chuyên đề đánh giá</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem phân quyền quản lý môn thi") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/phan-quyen-quan-ly-mon-thi"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <div className="flex items-center space-x-2">
                    <MilitaryTechIcon color="primary" />
                    <span>Phân quyền QL kiến thức đánh giá</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem câu hỏi") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/danh-sach-cau-hoi"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <div className="flex items-center space-x-2">
                    <LocalPoliceIcon color="primary" />
                    <span>Ngân hàng câu hỏi</span>
                  </div>
                </NavLink>
              </li>
            )}

            {roles && roles.includes("xem cuộc thi") && (
              <>
                <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                  <NavLink
                    to="/admin/quan-ly-cac-cuoc-thi"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <LocalPoliceIcon color="primary" />
                      <span>Quản lý cuộc đánh giá</span>
                    </div>
                  </NavLink>
                </li>
                <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                  <NavLink
                    to="/admin/thongke"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <LocalPoliceIcon color="primary" />
                      <span>Thống kê hệ thống</span>
                    </div>
                  </NavLink>
                </li>
                <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                  <NavLink
                    to="/admin/domain-dia-phuong"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <LocalPoliceIcon color="primary" />
                      <span>Quản lý domain địa phương</span>
                    </div>
                  </NavLink>
                </li>
                <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                  <NavLink
                    to="/admin/thong-ke-dia-phuong"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <LocalPoliceIcon color="primary" />
                      <span>Thống kê kết quả toàn quốc</span>
                    </div>
                  </NavLink>
                </li>
                <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                  <NavLink
                    to="/admin/video"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <LocalPoliceIcon color="primary" />
                      <span>Quản lý video tuyên truyền</span>
                    </div>
                  </NavLink>
                </li>
                <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                  <NavLink
                    to="/admin/thu-vien-luat"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <LocalPoliceIcon color="primary" />
                      <span>Cẩm nang an toàn giao thông</span>
                    </div>
                  </NavLink>
                </li>
              </>
            )}

            <li
              className="text-md my-2 hover:font-bold transition-all py-2 border-b hover:cursor-pointer"
              onClick={handleLogout}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <LogoutIcon color="primary" />
                  <span>Đăng xuất</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </Drawer>

      <Box className="mt-2">
        <Outlet />
      </Box>

      <div className="bg-[#1976d2] py-4 pl-4 mb-2 text-center text-white text-sm mx-2 mr-2 p-2 border-t-black border-t-[1px] shadow-md">
        <div className="flex items-center justify-center">
          <img src="/logoc08.png" className="w-12" />
        </div>
        <h5>@2026 - Bản quyền thuộc Công an tỉnh Hưng Yên</h5>
        <h5 className="font-light">
          Ứng dụng công nghệ thông tin trong công tác tuyên truyền, phổ biến,
          giáo dục pháp luật về trật tự an toàn giao thông
        </h5>
      </div>
    </div>
  );
}
