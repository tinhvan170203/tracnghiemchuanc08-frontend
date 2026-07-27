import React, { useState } from "react";
import PropTypes from "prop-types";
import { InputField } from "../../components/form-control/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@mui/material";
import { PasswordField } from "../../components/form-control/PasswordField";
import axiosConfig from "../../api/axiosConfig";
import LoginIcon from "@mui/icons-material/Login";
import { Link, useNavigate } from "react-router-dom";
import RedoIcon from "@mui/icons-material/Redo";
import { useSnackbar } from "notistack";
import userApi from "../../api/userApi";
import { HEADER_1, HEADER_2 } from "../../../constant/constant";

const schema = yup
  .object({
    tentaikhoan: yup.string().required("Vui lòng nhập tên tài khoản"),
    matkhau: yup.string().required("Vui lòng nhập mật khẩu"),
    matkhaumoi: yup.string().required("Vui lòng nhập mật khẩu mới"),
  })
  .required();

function ChangePassPage(props) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: {
      tentaikhoan: "",
      matkhau: "",
      matkhaumoi: "",
    },
    resolver: yupResolver(schema),
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmitForm = async (values) => {
    try {
      await userApi.changePage(values);
      enqueueSnackbar("Đổi mật khẩu thành công. Vui lòng đăng nhập lại", {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    // <div className='flex items-center min-h-screen justify-center bg-center bg-cover  border-white' style={{ backgroundImage: `url('/banner.png')` }} >
    <div className='flex items-center min-h-screen justify-center bg-center bg-cover  border-white' style={{ backgroundImage: `url('/c08.jpg')` }} >
      <div className="md:basis-1/2 sm:basis-full lg:basis-1/3 p-4 shadow-xl border-2 border-yellow-600 bg-yellow-100/90 rounded-lg mx-2">
        <div className="flex flex-col items-center">
          <img
            src="/cong-an-hieu.png"
            alt="conganhieu"
            className="w-[100px]"
          />
          <p className="uppercase text-[14px] md:text-[18px] font-bold text-[#ab0000]">{HEADER_1}</p>
          <p className="font-bold text-[14px] md:text-[18px] uppercase text-center text-[#ab0000]">
            {HEADER_2}
          </p>
        </div>
        <div className="md:basis-1/2 sm:basis-full lg:basis-1/3 px-1">
          <form onSubmit={form.handleSubmit(handleSubmitForm)}>
            <InputField
              name="tentaikhoan"
              label="Tên tài khoản"
              form={form}
              disabled={false}
            />

            <PasswordField
              name="matkhau"
              label="Mật khẩu cũ"
              form={form}
              disabled={false}
            />

            <PasswordField
              name="matkhaumoi"
              label="Mật khẩu mới"
              form={form}
              disabled={false}
            />

            {error && <p className="text-sm text-red-800">{error}</p>}

            <div>
              <Button
                color="warning"
                type="submit"
                variant="contained"
                startIcon={<LoginIcon />}
                fullWidth
                style={{ margin: "8px auto" }}
              >
                Đổi mật khẩu
              </Button>
            </div>
            <Link to="/login">
              <p className="my-2 text-end underline font-semibold text-red-800">
                Quay lại đăng nhập
              </p>
            </Link>
          </form>
          <p className="text-center text-slate-700 font-bold text-[13px] md:text-md">Bản quyền thuộc Công an tỉnh Hưng Yên</p>
          <p className="text-center text-slate-600 text-[12px] md:text-md">Ứng dụng công nghệ thông tin trong công tác tuyên truyền, phổ biến, giáo dục pháp luật về trật tự an toàn giao thông</p>
        </div>
      </div>
    </div>
  );
}

ChangePassPage.propTypes = {};

export default ChangePassPage;
