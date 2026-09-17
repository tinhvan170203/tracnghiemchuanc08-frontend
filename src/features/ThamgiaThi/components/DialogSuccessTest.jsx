import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useRef, useState } from "react";
import Giaychungnhan from "../../Giaychungnhan";
import commonApi from "../../../api/commonApi";

const FACEBOOK_PAGE_URL =
  import.meta.env.VITE_FACEBOOK_PAGE_URL ||
  "https://www.facebook.com/cuccanhsatgiaothong";

function msToHMS(ms) {
  // Đảm bảo ms không âm
  if (ms < 0) ms = 0;

  // 1- Chuyển sang giây:
  let seconds = ms / 1000;

  // 2- Trích xuất giờ:
  const hours = Math.floor(seconds / 3600); // 3,600 giây trong 1 giờ
  seconds = seconds % 3600; // số giây còn lại sau khi trích xuất giờ

  // 3- Trích xuất phút:
  const minutes = Math.floor(seconds / 60); // 60 giây trong 1 phút

  // 4- Giữ lại giây:
  seconds = seconds % 60;

  // Làm tròn giây và đảm bảo có 2 chữ số (ví dụ: 05)
  const formattedSeconds = seconds.toFixed(0).padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  if (hours === 0) {
    return `${formattedMinutes} : ${formattedSeconds}`;
  }
  // Định dạng đầy đủ: HH:MM:SS
  const formattedHours = hours.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function buildFanpagePayload() {
  const thisinh =
    readJson("thongtin_doituong") ||
    readJson("thongtin_doituong_tuhoc") ||
    {};
  // loginTest lưu cuộc thi vào key "thongtinthisinh"
  const cuocthiDoc = readJson("thongtinthisinh") || {};

  return {
    name: thisinh.name || "",
    phone: thisinh.phone || "",
    birthday: thisinh.birthday ?? "",
    donvi: thisinh.donvi || "",
    hokhau: thisinh.hokhau || "",
    gioitinh: thisinh.gioitinh || "",
    loaixe: thisinh.loaixe || "",
    hang_gplx: thisinh.hang_gplx || "",
    nghenghiep: thisinh.nghenghiep || "",
    cuocthi: cuocthiDoc._id || null,
    tencuocthi: cuocthiDoc.tencuocthi || "",
    origin: typeof window !== "undefined" ? window.location.origin : "",
    hostname: typeof window !== "undefined" ? window.location.hostname : "",
  };
}

export default function DialogSuccessTest({
  open,
  onCloseDialogSuccessTest,
  result,
  onSubmit,
  onOpenPreviewMode,
  handleSubmitOut,
}) {
  const handleFormSubmit = () => {
    onSubmit();
  };

  const refCon = useRef();
  const [chungNhanLoading, setChungNhanLoading] = useState(false);

  const runChungNhan = async (fn) => {
    if (!refCon.current || !fn) return;
    setChungNhanLoading(true);
    try {
      await fn();
    } finally {
      setChungNhanLoading(false);
    }
  };

  const saveGiaychungnhan = () => {
    runChungNhan(refCon.current?.saveGiaychungnhan);
  };

  const xemGiaychungnhan = () => {
    runChungNhan(refCon.current?.xemGiaychungnhan);
  };

  const handleOpenFanpage = () => {
    const payload = buildFanpagePayload();
    if (payload.cuocthi) {
      commonApi.logFanpageClick(payload).catch(() => {});
    }
    window.open(FACEBOOK_PAGE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogSuccessTest(event, reason);
          }
        }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
          <p className="text-center text-sm md:text-lg uppercase font-semibold text-slate-800">
            Cảm ơn bạn đã tham gia hoàn thành bài thu hoạch!
          </p>
          <div className="flex items-center justify-center my-2">
            <img src="/thanks.png" alt="img" className="md:w-[300px]" />
          </div>
          <p className="text-center text-sm md:text-lg text-green-700 mb-4">
            Chúc mừng bạn đã hoàn thành bài thi với{" "}
            <span className="font-bold">
              {result.choicedTrue}/{result.allQuestion}
            </span>{" "}
            câu trả lời đúng trong khoảng thời gian {msToHMS(result.time)}
          </p>

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50 px-3 py-3 mb-3">
            <p className="text-center text-xs md:text-sm text-slate-600 mb-2">
              Theo dõi fanpage để nhận thông tin tuyên truyền an toàn giao thông
            </p>
            <div className="flex justify-center">
              <Button
                variant="contained"
                size="medium"
                startIcon={<FacebookIcon />}
                onClick={handleOpenFanpage}
                sx={{
                  bgcolor: "#1877F2",
                  "&:hover": { bgcolor: "#0d65d9" },
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "12px",
                  px: 2.5,
                  boxShadow: "0 8px 20px rgba(24,119,242,0.28)",
                }}
              >
                Theo dõi fanpage Cục CSGT
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outlined"
              size="small"
              disabled={chungNhanLoading}
              onClick={() => xemGiaychungnhan()}
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              {chungNhanLoading ? "Đang tạo..." : "Xem giấy chứng nhận"}
            </Button>
            <Button
              variant="contained"
              size="small"
              disabled={chungNhanLoading}
              onClick={() => saveGiaychungnhan()}
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              Tải giấy chứng nhận
            </Button>
            <Button
              color="info"
              variant="contained"
              size="small"
              onClick={handleFormSubmit}
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              Làm lại bài thi
            </Button>
            <Button
              color="warning"
              variant="contained"
              size="small"
              onClick={onOpenPreviewMode}
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              Xem lại bài thi
            </Button>
            <Button
              color="error"
              variant="contained"
              size="small"
              onClick={handleSubmitOut}
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              Thoát
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Giaychungnhan result={result} ref={refCon} />
    </>
  );
}
