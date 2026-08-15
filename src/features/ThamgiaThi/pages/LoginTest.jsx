import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, LinearProgress } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { InputField } from "../../../components/form-control/InputField";
import { SelectFieldNoneAll } from "../../../components/form-control/SelectFieldNoneAll";

import commonApi from "../../../api/commonApi";
import { FileText } from "lucide-react";
import CryptoJS from 'crypto-js';
import { HEADER_1, HEADER_2 } from "../../../../constant/constant";

const saveEncryptedExam = (questionList, secretKey) => {
  try {
    const dataString = JSON.stringify(questionList);
    const encrypted = CryptoJS.AES.encrypt(dataString, secretKey).toString();
    localStorage.setItem('question_list', encrypted);
  } catch (error) {
    console.error("Lỗi mã hóa:", error);
  }
};

const schema = yup
  .object({
    name: yup.string().required("Vui lòng nhập họ tên"),
    birthday: yup
      .string()
      .required("Vui lòng nhập năm sinh")
      .matches(/^\d{4}$/, "Năm sinh phải gồm đúng 4 chữ số"),
    phone: yup.string().required("Vui lòng nhập địa chỉ..."),
    donvi: yup.string().required("Vui lòng nhập số điện thoại liên hệ"),
    gioitinh: yup.string().required("Vui lòng chọn giới tính"),
    loaixe: yup.string().required("Vui lòng chọn loại xe điều khiển"),
    hang_gplx: yup.string().required("Vui lòng nhập hạng GPLX"),
    nghenghiep: yup.string().required("Vui lòng nhập nghề nghiệp"),
  })
  .required();

function LoginTest() {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [test, setTest] = useState(null);
  const [name, setName] = useState('');
  const [donvi, setDonvi] = useState('');

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      birthday: '',
      phone: '',
      donvi: '',
      gioitinh: 'Nam',
      loaixe: 'Mô tô',
      hang_gplx: '',
      nghenghiep: '',
    }
  });
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const checkedTest = async () => {
      try {
        let res = await commonApi.checkCuocthi({ id });
        // let checkName = ['698298f9f526e9e47993c8a7', '698298eff526e9e47993c8a1'].includes(res.data.monthi) ? "Lớp" : "Đơn vị (Lớp...)"
        // let checkDonvi= ['698298f9f526e9e47993c8a7', '698298eff526e9e47993c8a1'].includes(res.data.monthi) ? "SĐT" : "SĐT"
        // let checkHokhau = ['698298f9f526e9e47993c8a7', '698298eff526e9e47993c8a1'].includes(res.data.monthi) ? "Trường" : "Hộ khẩu thường trú (Trường...)"
        // setName(checkName)
        // setDonvi(checkDonvi)
        // setHokhau(checkHokhau)
        setTest(res.data);
        setIsDisable(false)
      } catch (error) {
        setIsDisable(true)
        if (error.response?.status === 500) {
          navigate('/not-found')
        } else {
          setError(error.response?.data?.message || "Có lỗi xảy ra");
          setIsDisable(true)
          setTest(error.response?.data?.test)
        }
      }
    };

    checkedTest();
  }, [id, navigate]);

  const handleSubmitForm = async (values) => {
    let data = { ...values, id_cuocthi: test._id };
    setError(null);
    try {
      let res = await commonApi.loginTest(data);
      localStorage.setItem("thongtinthisinh", JSON.stringify(res.data.item));
      saveEncryptedExam(res.data.questionsSendClient, res.data.secretKey);
      localStorage.setItem("thongtinbaithi", JSON.stringify(res.data.cuocthi));
      localStorage.setItem("exam_secret_key", res.data.secretKey);
      navigate("/vao-thi");
      enqueueSnackbar("Chúc bạn đạt kết quả tốt nhất!", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className='flex items-center min-h-screen justify-center bg-center bg-cover' style={{ backgroundImage: `url('/c08.jpg')` }} > 
      <div className="md:basis-1/2 sm:basis-full lg:basis-1/3 p-1 relative shadow-xl border-2 border-yellow-600 bg-yellow-50/95 rounded-lg mx-2">
        {isSubmitting && <LinearProgress />}
        <div className="flex flex-col items-center">
          <div className="flex items-center ">
            <img src="/cong-an-hieu.png" alt="conganhieu" className="w-[80px]" />
            <img src="/logoc08.png" className="w-[54px]" alt="" />
          </div>
          <p className="uppercase text-[13px] md:text-[16px] font-bold text-[#ffee00] [text-shadow:_1px_1px_2px_black]">{HEADER_1}</p>
          <p className="font-bold text-[13px] md:text-[16px] uppercase text-center text-[#ffee00] [text-shadow:_1px_1px_2px_black]">
           {HEADER_2}
          </p>
        </div>

        {test && (
          <p className="md:text-md mt-2 text-[13px] text-black font-semibold text-center">
            {test.tencuocthi}
          </p>
        )}
        <hr />
        
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="px-1">
          <InputField
            name="name"
            label="Họ và tên"
            form={form}
            disabled={isDisable}
          />
          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <InputField
                name="birthday"
                label="Năm sinh"
                form={form}
                type="text"
                inputMode="numeric"
                maxLength={4}
                digitsOnly
                disabled={isDisable}
              />
            </div>
            <div className="flex-1 min-w-0">
              <SelectFieldNoneAll
                name="gioitinh"
                label="Giới tính"
                form={form}
                disabled={isDisable}
                focused
                options={[
                  { value: "Nam", label: "Nam" },
                  { value: "Nữ", label: "Nữ" },
                ]}
              />
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <SelectFieldNoneAll
                name="loaixe"
                label="Loại xe điều khiển"
                form={form}
                disabled={isDisable}
                focused
                options={[
                  { value: "Ô tô", label: "Ô tô" },
                  { value: "Mô tô", label: "Mô tô" },
                  { value: "Cả hai", label: "Cả hai" },
                ]}
              />
            </div>
            <div className="flex-1 min-w-0">
              <InputField
                name="hang_gplx"
                label="Hạng GPLX"
                form={form}
                disabled={isDisable}
              />
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <InputField
                name="nghenghiep"
                label="Nghề nghiệp"
                form={form}
                disabled={isDisable}
              />
            </div>
            <div className="flex-1 min-w-0">
              <InputField
                name="donvi"
                label="SĐT"
                form={form}
                disabled={isDisable}
                type="number"
              />
            </div>
          </div>
          <InputField
            name="phone"
            label="Địa chỉ"
            form={form}
            disabled={isDisable}
          />
          {error && (
            <p className="md:text-md text-sm text-center m-2 text-red-600 font-semibold">{error}</p>
          )}

          <div className="flex space-x-2">
            <div className="basis-full">
              <Button
                color="warning"
                type="submit"
                disabled={isDisable}
                variant="contained"
                startIcon={<LoginIcon />}
                fullWidth
                style={{ margin: "8px auto" }}
                size="small"
              >
                Tham gia kiểm tra nhận thức
              </Button>
            </div>
          </div>
        </form>

        <div className="flex justify-center">
          <FileText size={20} style={{ color: "orangered" }} />
          <a href="/cam-nang-an-toan-giao-thong" className="text-[14px] hover:underline" style={{ color: "orangered" }}>Cẩm nang an toàn giao thông</a>
        </div>
        <div className="flex justify-center">
          <a href="/video-tuyen-truyen" className="text-[14px] hover:underline" style={{ color: "orangered" }}>Video tuyên truyền an toàn giao thông</a>
        </div>
        <div className="flex justify-center">
          <a href="/hoc-tap" className="text-[14px] hover:underline" style={{ color: "orangered" }}>Tìm hiểu kiến thức về an toàn giao thông</a>
        </div>
        <p className="text-center text-gray-500 font-semibold uppercase text-[14px]">Cục Cảnh sát giao thông và Công an tỉnh Hưng Yên phối hợp thực hiện</p>
        <a href="/hoi-dap-voi-tro-ly-ao" className="absolute right-0 top-0 hover:cursor-pointer" >
          <img src='/AIgiaothong.png' className='w-20 md:w-[120px]' alt="" />
          <span className="text-[8px] absolute top-[-32px] left-[-24px] rounded-tl-2xl rounded-br-2xl bg-white py-1 px-1">Hỏi đáp với trợ lý ảo giao thông</span>
        </a>
      </div>
    </div>
  );
}

export default LoginTest;
