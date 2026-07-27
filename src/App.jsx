import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";

import { Navigate, Route, Routes } from "react-router-dom";
import TemplateChungnhan from "./features/TemplateChungnhan";
import QuanlyDiaphuong from "./features/Quanlydonvi/QuanlyDonvi";
import ThongkeDiaphuong from "./features/ThongkeDiaphuong";
import Videos from "./features/Videos/Videos";
import VideoTuyentruyen from "./features/VideoTuyentruyen";
import Learning from "./features/Learning";
import DetailChuyenmuc from "./features/Learning/components/DetailChuyenmuc"
import LearningCauhoi from "./features/Learning/components/LearningCauhoi";
import TuKiemTra from "./features/Learning/components/TuKiemTra";
// import Chuyende from "./features/DanhsachCauhoi copy/Chuyende";
// import AppUpdater from "../AppAdapter";
// import NotFoundCuocthi from "./features/NotFoundCuocthi";

const Chuyende  = lazy(() => import("./features/DanhsachCauhoi copy/Chuyende"));
const LoadingComponent = lazy(() => import("./components/LoadingComponent"));
const NotFoundCuocthi = lazy(() => import("./features/NotFoundCuocthi"));
const LoginPage = lazy(() => import("./auth/Login/LoginPage"));
const AppUpdater = lazy(() => import("../AppAdapter"));
const Thongke = lazy(() => import("./features/Thongke"));
const ChatGPT = lazy(() => import("./features/ChatGPT"));
const Tailieus = lazy(() => import("./features/Tailieus"));
const ThuvienLuat = lazy(() => import("./features/Thuvien"));
const Monthi = lazy(() => import("./features/Monthi/Monthi"));
const DanhsachCauhoi = lazy(() => import("./features/DanhsachCauhoi/DanhsachCauhoi"));
const ThiSinhDuThi = lazy(() => import("./features/ThiSinhDuThi/ThiSinhDuThi"));
const ManageCuocthi = lazy(() => import("./features/ManageCuocthi/pages/ManageCuocthi"));
const Test = lazy(() => import("./features/ThamgiaThi/pages/Test"));
const LoginTest = lazy(() => import("./features/ThamgiaThi/pages/LoginTest"));
const KetquaThi = lazy(() => import("./features/ManageCuocthi/pages/KetquaThi"));
const PhanquyenQuanlyDonvi = lazy(() => import("./features/PhanquyenQuanlyDonvi/PhanquyenQuanlyDonvi"));


const ChangePassPage = lazy(() => import("./auth/ChangePass/ChangePassPage"));
const QuanlyTaikhoan = lazy(() => import("./features/Auth/QuanlyTaikhoan"));
const AdminDarboard = lazy(() => import("./components/Admin"));
const QuanlyDonvi = lazy(() => import("./features/Quanlydonvi/QuanlyDonvi"));

function App() {
  
  return (
    <>
      <AppUpdater />
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          <Route path="/:id" element={<LoginTest />} />
          <Route path="/hoi-dap-voi-tro-ly-ao" element={<ChatGPT />} />
          <Route path="/cam-nang-an-toan-giao-thong" element={<Tailieus/>} />
          <Route path="/video-tuyen-truyen" element={<VideoTuyentruyen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/not-found" element={<NotFoundCuocthi />} />
          <Route path="/vao-thi" element={<Test />} />
          <Route path="/doimatkhau" element={<ChangePassPage />} />
          <Route path="/hoc-tap" element={<Learning />} />
          <Route path="/tu-kiem-tra/:id_cuocthi" element={<TuKiemTra />} />
          <Route path="/:id_monthi/chuyendes" element={<DetailChuyenmuc />} />
          <Route path="/chuyendes/:chuyendeId/cauhois" element={<LearningCauhoi />} />
          <Route path="/admin/" element={<AdminDarboard />}>
            <Route path="thu-vien-luat" element={<ThuvienLuat />} />
            <Route path="video" element={<Videos />} />
            <Route path="thongke" element={<Thongke />} />
            <Route path="thong-ke-dia-phuong" element={<ThongkeDiaphuong />} />
            <Route path="quan-ly-tai-khoan" element={<QuanlyTaikhoan />} />
            <Route path="domain-dia-phuong" element={<QuanlyDiaphuong />} />
            <Route
              path="phan-quyen-quan-ly-mon-thi"
              element={<PhanquyenQuanlyDonvi />}
            />
            <Route
              path="quan-ly-mon-thi"
              element={<Monthi />}
            />
            <Route
              path="danh-sach-cau-hoi"
              element={<DanhsachCauhoi />}
            />
            <Route
              path="quan-ly-cac-cuoc-thi"
              element={<ManageCuocthi />}
            />
            <Route
              path="ket-qua-thi/cuoc-thi/:id"
              element={<KetquaThi />}
            />
            <Route
              path="cuoc-thi/:id/thi-sinh"
              element={<ThiSinhDuThi />}
            >
            </Route>
            <Route
              path="mon-thi/chuyen-de"
              element={<Chuyende />}
            >
            </Route>
          </Route>
            <Route
              path="giaychungnhan"
              element={<TemplateChungnhan result={null}/>}
            />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
