import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// import commonApi from '../../api/commonApi';
// import { saveEncryptedExam } from './utils'; // hàm bạn đã có sẵn
import UserInfoForm from '../components/UserInfoForm';
import commonApi from '../../../api/commonApi';
import CryptoJS from 'crypto-js';
const saveEncryptedExam = (questionList, secretKey) => {
  try {
    // 1. Chuyển Object/Array sang chuỗi JSON
    const dataString = JSON.stringify(questionList);

    // 2. Mã hóa AES với secretKey
    const encrypted = CryptoJS.AES.encrypt(dataString, secretKey).toString();

    // 3. Lưu vào localStorage
    localStorage.setItem('question_list', encrypted);
  } catch (error) {
    console.error("Lỗi mã hóa:", error);
  }
};
export default function TuKiemTra() {
  const { id_cuocthi } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmitForm = async (values) => {
    let data = { ...values, id_cuocthi };
    setError(null);
    try {
      let res = await commonApi.loginTest(data);
      localStorage.setItem("thongtin_doituong_tuhoc", JSON.stringify(data));
      localStorage.setItem(
        "thongtin_doituong",
        JSON.stringify({
          name: data.name,
          phone: data.phone,
          birthday: data.birthday,
          donvi: data.donvi,
          hokhau: data.hokhau,
          gioitinh: data.gioitinh,
          loaixe: data.loaixe,
          hang_gplx: data.hang_gplx,
          nghenghiep: data.nghenghiep,
        })
      );
      localStorage.setItem("thongtinthisinh", JSON.stringify(res.data.item));
      saveEncryptedExam(res.data.questionsSendClient, res.data.secretKey);
      localStorage.setItem("thongtinbaithi", JSON.stringify(res.data.cuocthi));
      localStorage.setItem("exam_secret_key", res.data.secretKey);
      navigate("/vao-thi?ontap=true");
      enqueueSnackbar("Chúc bạn đạt kết quả tốt nhất!", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
    } catch (error) {
      console.log(error)
      setError(error);
      setLoading(false); // để hiện form cho user thử lại nếu auto-submit lỗi
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("thongtin_doituong_tuhoc");
    const thisinh = raw ? JSON.parse(raw) : null;

    const hasFullInfo =
      thisinh &&
      thisinh.name &&
      /^\d{4}$/.test(String(thisinh.birthday || "")) &&
      thisinh.gioitinh &&
      thisinh.loaixe &&
      thisinh.hang_gplx &&
      thisinh.nghenghiep &&
      thisinh.donvi &&
      thisinh.phone &&
      thisinh.hokhau;

    if (hasFullInfo) {
      handleSubmitForm({
        name: thisinh.name,
        birthday: thisinh.birthday,
        phone: thisinh.phone,
        donvi: thisinh.donvi,
        hokhau: thisinh.hokhau || "",
        gioitinh: thisinh.gioitinh,
        loaixe: thisinh.loaixe,
        hang_gplx: thisinh.hang_gplx,
        nghenghiep: thisinh.nghenghiep,
      });
    } else {
      // chưa có / thiếu field mới -> hiện form
      setLoading(false);
    }
  }, [id_cuocthi]);

  if (loading) return <div>Đang chuẩn bị bài kiểm tra...</div>;

  return <UserInfoForm onSubmit={handleSubmitForm} error={error} />;
}