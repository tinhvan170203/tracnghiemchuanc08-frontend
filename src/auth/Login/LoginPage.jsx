import React, { useState } from "react";
import PropTypes from "prop-types";
import { InputField } from "../../components/form-control/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, LinearProgress } from "@mui/material";
import { PasswordField } from "../../components/form-control/PasswordField";
import axiosConfig from "./../../api/axiosConfig";
import LoginIcon from "@mui/icons-material/Login";
import { Link, useNavigate } from "react-router-dom";
import RedoIcon from "@mui/icons-material/Redo";
import { useDispatch } from "react-redux";
import { loginAccount } from "../authSlice";
import { useSnackbar } from "notistack";
import { unwrapResult } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { HEADER_1, HEADER_2 } from "../../../constant/constant";

const schema = yup
  .object({
    tentaikhoan: yup.string().required("Vui lòng nhập tên tài khoản"),
    matkhau: yup.string().required("Vui lòng nhập mật khẩu"),
  })
  .required();

function LoginPage(props) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: {
      tentaikhoan: "",
      matkhau: "",
    },
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmitForm = async (values) => {
    const action = loginAccount(values);
    try {
      const resultAction = await dispatch(action);
      const data = unwrapResult(resultAction);
      enqueueSnackbar("Đăng nhập tài khoản thành công!", {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });

    // 1. SỬA: Không cần gọi Cookies.remove() trước đó, Cookies.set() sẽ tự động ghi đè
    // 2. SỬA: Thêm cấu hình path và cùng domain để tất cả các trang, các API đều đọc được cookie này
    // Cookies.set("refreshToken_thitracnghiem", data.refreshToken, {
    //   expires: 7,
    //   path: "/", // QUAN TRỌNG: Để cookie có hiệu lực toàn bộ trang web
    //   sameSite: "Lax", // Nếu chạy chung localhost khác port, hoặc để "None" nếu chạy HTTPS khác domain
    //   secure: window.location.protocol === "https:", // Tự động bật secure nếu chạy trên https
    // });
      navigate("/admin/danh-sach-cau-hoi");
    } catch (error) {
      setError("Sai tên tài khoản hoặc mật khẩu");
    }
  };

  const { isSubmitting } = form.formState;

  return (
      // <div className='flex items-center min-h-screen justify-center bg-center bg-cover  border-white' style={{ backgroundImage: `url('/banner.png')` }} >
     <div className='flex items-center min-h-screen justify-center bg-center bg-cover  border-white' style={{ backgroundImage: `url('/c08.jpg')` }} > 
      <div className="md:basis-1/2 sm:basis-full lg:basis-1/3 p-4 shadow-xl border-2 border-yellow-600 bg-yellow-100/90 rounded-lg mx-2">
        {isSubmitting && <LinearProgress />}
        <div className="flex flex-col items-center">
          <img
            src="/cong-an-hieu.png"
            alt="conganhieu"
            className="w-[100px]"
          />
          {/* <p className="uppercase text-[14px] md:text-[18px] font-bold text-[#ab0000]">Công an tỉnh Hưng Yên</p>
          <p className="font-bold text-[14px] md:text-[18px] uppercase text-center text-[#ab0000]">
            Phòng Cảnh sát giao thông
          </p> */}
          <p className="uppercase text-[14px] md:text-[18px] font-bold text-[#ab0000]">{HEADER_1}</p>
          <p className="font-bold text-[14px] md:text-[18px] uppercase text-center text-[#ab0000]">
           {HEADER_2}
          </p>
        </div>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="py-1 px-1">
          <InputField
            name="tentaikhoan"
            label="Tên tài khoản"
            form={form}
            disabled={false}
          />

          <PasswordField
            name="matkhau"
            label="Mật khẩu"
            form={form}
            disabled={false}
          />

          {error && (
            <p className="text-md text-center m-2 text-red-800">{error}</p>
          )}

          <div>
            <Button
              type="submit"
              variant="contained"
              startIcon={<LoginIcon />}
              color="warning"
              fullWidth
              style={{ margin: "8px auto" }}
            >
              Đăng nhập
            </Button>
          </div>

          <Link to="/doimatkhau">
            <p className="my-2 text-end underline font-semibold text-red-800">
              Đổi mật khẩu
            </p>
          </Link>
        </form>

        <p className="text-center text-gray-700 font-semibold text-[14px] md:text-[16px]">Bản quyền thuộc Công an tỉnh Hưng Yên</p>
        <p className="text-center text-slate-600 text-[12px] md:text-[14px]">Ứng dụng công nghệ thông tin trong công tác tuyên truyền, phổ biến, giáo dục pháp luật về trật tự an toàn giao thông</p>

      </div>

    </div>
  );
}

LoginPage.propTypes = {};

export default LoginPage;
