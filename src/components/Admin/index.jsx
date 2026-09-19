import React, { useEffect, useState, Suspense } from "react";
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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import QuizIcon from "@mui/icons-material/Quiz";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LanguageIcon from "@mui/icons-material/Language";
import PublicIcon from "@mui/icons-material/Public";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FacebookIcon from "@mui/icons-material/Facebook";
import ForumIcon from "@mui/icons-material/Forum";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSnackbar } from "notistack";
import LogoutIcon from "@mui/icons-material/Logout";
import SiteFooter from "../SiteFooter";
import LoadingComponent from "../LoadingComponent";
import { fetchCurrentUser, logoutAccount } from "../../auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { HEADER_2 } from "../../../constant/constant";

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
      await dispatch(logoutAccount()).unwrap();
      enqueueSnackbar("Đăng xuất tài khoản thành công!", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Đã đăng xuất khỏi phiên làm việc", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
    } finally {
      navigate("/login", { replace: true });
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
    <div className="bg-white min-h-screen">
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
               Tuyên truyền, đánh giá nhận thức, kiến thức pháp luật về trật tự, an toàn giao thông
              </span>
              <span className="md:hidden text-[8px] md:text-[14px] uppercase">
                Tuyên truyền, đánh giá nhận thức, kiến thức pháp luật về trật tự, an toàn giao thông
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
                    <MenuBookIcon color="primary" />
                    <span>Quản lý kiến thức đánh giá</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem chuyên đề") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/mon-thi/chuyen-de"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <div className="flex items-center space-x-2">
                    <CategoryIcon color="primary" />
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
                    <QuizIcon color="primary" />
                    <span>Ngân hàng câu hỏi</span>
                  </div>
                </NavLink>
              </li>
            )}

            {roles && roles.includes("xem cuộc thi") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/quan-ly-cac-cuoc-thi"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <EmojiEventsIcon color="primary" />
                    <span>Quản lý cuộc đánh giá</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem domain địa phương") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/domain-dia-phuong"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <LanguageIcon color="primary" />
                    <span>Quản lý domain địa phương</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem lượt theo dõi fanpage") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/fanpage-clicks"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <FacebookIcon color="primary" />
                    <span>Lượt theo dõi fanpage</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem fanpage toàn quốc") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/fanpage-toan-quoc"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <PublicIcon color="primary" />
                    <span>Fanpage toàn quốc</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem hỏi đáp AI") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/ai-chat-logs"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <ForumIcon color="primary" />
                    <span>Hỏi đáp AI</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem hỏi đáp AI toàn quốc") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/ai-chat-toan-quoc"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <TravelExploreIcon color="primary" />
                    <span>Hỏi đáp AI toàn quốc</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem thống kê hệ thống") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/thongke"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <BarChartIcon color="primary" />
                    <span>Thống kê hệ thống</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem thống kê toàn quốc") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/thong-ke-dia-phuong"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <PublicIcon color="primary" />
                    <span>Thống kê kết quả toàn quốc</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem câu hỏi hay sai") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/thong-ke-cau-hoi-sai"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <ReportProblemIcon color="primary" />
                    <span>Câu hỏi hay sai</span>
                  </div>
                </NavLink>
              </li>
            )}

            {roles && roles.includes("xem video tuyên truyền") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/video"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <OndemandVideoIcon color="primary" />
                    <span>Quản lý video tuyên truyền</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem cẩm nang giao thông") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/thu-vien-luat"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <AutoStoriesIcon color="primary" />
                    <span>Cẩm nang an toàn giao thông</span>
                  </div>
                </NavLink>
              </li>
            )}
            {roles && roles.includes("xem tài liệu AI") && (
              <li className="text-md my-2 hover:font-bold transition-all py-2 border-b">
                <NavLink
                  to="/admin/ai-knowledge"
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <SmartToyIcon color="primary" />
                    <span>Tài liệu kiến thức AI</span>
                  </div>
                </NavLink>
              </li>
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
        <Suspense fallback={<LoadingComponent />}>
          <Outlet />
        </Suspense>
      </Box>

      <SiteFooter variant="admin" />
    </div>
  );
}
