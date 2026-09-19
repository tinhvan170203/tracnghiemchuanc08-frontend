import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingComponent from "./components/LoadingComponent";
import RequireRole from "./components/RequireRole";
import AdminDarboard from "./components/Admin";

const TemplateChungnhan = lazy(() => import("./features/TemplateChungnhan"));
const QuanlyDiaphuong = lazy(() => import("./features/Quanlydonvi/QuanlyDonvi"));
const ThongkeDiaphuong = lazy(() => import("./features/ThongkeDiaphuong"));
const Videos = lazy(() => import("./features/Videos/Videos"));
const VideoTuyentruyen = lazy(() => import("./features/VideoTuyentruyen"));
const Learning = lazy(() => import("./features/Learning"));
const DetailChuyenmuc = lazy(() =>
  import("./features/Learning/components/DetailChuyenmuc")
);
const LearningCauhoi = lazy(() =>
  import("./features/Learning/components/LearningCauhoi")
);
const TuKiemTra = lazy(() =>
  import("./features/Learning/components/TuKiemTra")
);
const KiemTra = lazy(() => import("./features/KiemTra"));
const DetailKiemTra = lazy(() =>
  import("./features/KiemTra/DetailKiemTra")
);
const Chuyende = lazy(() => import("./features/DanhsachCauhoi copy/Chuyende"));
const NotFoundCuocthi = lazy(() => import("./features/NotFoundCuocthi"));
const LoginPage = lazy(() => import("./auth/Login/LoginPage"));
const AppUpdater = lazy(() => import("../AppAdapter"));
const Thongke = lazy(() => import("./features/Thongke"));
const ThongkeCauhoiSai = lazy(() => import("./features/ThongkeCauhoiSai"));
const ChatGPT = lazy(() => import("./features/ChatGPT"));
const Tailieus = lazy(() => import("./features/Tailieus"));
const ThuvienLuat = lazy(() => import("./features/Thuvien"));
const Monthi = lazy(() => import("./features/Monthi/Monthi"));
const DanhsachCauhoi = lazy(() =>
  import("./features/DanhsachCauhoi/DanhsachCauhoi")
);
const ThiSinhDuThi = lazy(() =>
  import("./features/ThiSinhDuThi/ThiSinhDuThi")
);
const ManageCuocthi = lazy(() =>
  import("./features/ManageCuocthi/pages/ManageCuocthi")
);
const Test = lazy(() => import("./features/ThamgiaThi/pages/Test"));
const LoginTest = lazy(() => import("./features/ThamgiaThi/pages/LoginTest"));
const KetquaThi = lazy(() =>
  import("./features/ManageCuocthi/pages/KetquaThi")
);
const PhanquyenQuanlyDonvi = lazy(() =>
  import("./features/PhanquyenQuanlyDonvi/PhanquyenQuanlyDonvi")
);
const ChangePassPage = lazy(() => import("./auth/ChangePass/ChangePassPage"));
const QuanlyTaikhoan = lazy(() => import("./features/Auth/QuanlyTaikhoan"));
const AiKnowledge = lazy(() => import("./features/AiKnowledge/AiKnowledge"));
const Home = lazy(() => import("./features/Home/Home"));
const FanpageClicks = lazy(() => import("./features/FanpageClicks"));
const FanpageToanquoc = lazy(() => import("./features/FanpageToanquoc"));
const AiChatLogs = lazy(() => import("./features/AiChatLogs"));
const AiChatToanquoc = lazy(() => import("./features/AiChatToanquoc"));

function withRole(role, element) {
  return <RequireRole role={role}>{element}</RequireRole>;
}

function App() {
  return (
    <>
      <Suspense fallback={null}>
        <AppUpdater />
      </Suspense>
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<LoginTest />} />
          <Route path="/hoi-dap-voi-tro-ly-ao" element={<ChatGPT />} />
          <Route path="/cam-nang-an-toan-giao-thong" element={<Tailieus />} />
          <Route path="/video-tuyen-truyen" element={<VideoTuyentruyen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/not-found" element={<NotFoundCuocthi />} />
          <Route path="/vao-thi" element={<Test />} />
          <Route path="/doimatkhau" element={<ChangePassPage />} />
          <Route path="/hoc-tap" element={<Learning />} />
          <Route path="/kiem-tra" element={<KiemTra />} />
          <Route path="/kiem-tra/:id_monthi" element={<DetailKiemTra />} />
          <Route path="/tu-kiem-tra/:id_cuocthi" element={<TuKiemTra />} />
          <Route path="/:id_monthi/chuyendes" element={<DetailChuyenmuc />} />
          <Route
            path="/chuyendes/:chuyendeId/cauhois"
            element={<LearningCauhoi />}
          />
          <Route path="/admin/" element={<AdminDarboard />}>
            <Route
              path="thu-vien-luat"
              element={withRole("xem cẩm nang giao thông", <ThuvienLuat />)}
            />
            <Route
              path="video"
              element={withRole("xem video tuyên truyền", <Videos />)}
            />
            <Route
              path="thongke"
              element={withRole("xem thống kê hệ thống", <Thongke />)}
            />
            <Route
              path="thong-ke-cau-hoi-sai"
              element={withRole("xem câu hỏi hay sai", <ThongkeCauhoiSai />)}
            />
            <Route
              path="thong-ke-dia-phuong"
              element={withRole("xem thống kê toàn quốc", <ThongkeDiaphuong />)}
            />
            <Route
              path="quan-ly-tai-khoan"
              element={withRole("xem tài khoản", <QuanlyTaikhoan />)}
            />
            <Route
              path="domain-dia-phuong"
              element={withRole("xem domain địa phương", <QuanlyDiaphuong />)}
            />
            <Route
              path="ai-knowledge"
              element={withRole("xem tài liệu AI", <AiKnowledge />)}
            />
            <Route
              path="phan-quyen-quan-ly-mon-thi"
              element={withRole(
                "xem phân quyền quản lý môn thi",
                <PhanquyenQuanlyDonvi />
              )}
            />
            <Route
              path="quan-ly-mon-thi"
              element={withRole("xem môn thi", <Monthi />)}
            />
            <Route
              path="danh-sach-cau-hoi"
              element={withRole("xem câu hỏi", <DanhsachCauhoi />)}
            />
            <Route
              path="quan-ly-cac-cuoc-thi"
              element={withRole("xem cuộc thi", <ManageCuocthi />)}
            />
            <Route
              path="fanpage-clicks"
              element={withRole("xem lượt theo dõi fanpage", <FanpageClicks />)}
            />
            <Route
              path="fanpage-toan-quoc"
              element={withRole("xem fanpage toàn quốc", <FanpageToanquoc />)}
            />
            <Route
              path="ai-chat-logs"
              element={withRole("xem hỏi đáp AI", <AiChatLogs />)}
            />
            <Route
              path="ai-chat-toan-quoc"
              element={withRole("xem hỏi đáp AI toàn quốc", <AiChatToanquoc />)}
            />
            <Route
              path="ket-qua-thi/cuoc-thi/:id"
              element={withRole("xem cuộc thi", <KetquaThi />)}
            />
            <Route
              path="cuoc-thi/:id/thi-sinh"
              element={withRole("xem cuộc thi", <ThiSinhDuThi />)}
            />
            <Route
              path="mon-thi/chuyen-de"
              element={withRole("xem chuyên đề", <Chuyende />)}
            />
          </Route>
          <Route
            path="giaychungnhan"
            element={<TemplateChungnhan result={null} />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
