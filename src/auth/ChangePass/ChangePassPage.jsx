import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import userApi from "../../api/userApi";
import { HEADER_1, HEADER_2 } from "../../../constant/constant";

const BRAND = "#d97706";
const BRAND_DARK = "#9a3412";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: BRAND,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: BRAND,
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND_DARK,
  },
};

const schema = yup
  .object({
    tentaikhoan: yup.string().required("Vui lòng nhập tên tài khoản"),
    matkhau: yup.string().required("Vui lòng nhập mật khẩu"),
    matkhaumoi: yup.string().required("Vui lòng nhập mật khẩu mới"),
  })
  .required();

function ChangePassPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({
    current: false,
    next: false,
  });
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
      setError(error.message || "Đổi mật khẩu thất bại");
    }
  };

  const { isSubmitting } = form.formState;
  const usernameField = form.register("tentaikhoan");
  const currentPasswordField = form.register("matkhau");
  const newPasswordField = form.register("matkhaumoi");

  const togglePassword = (field) => {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  return (
    <div className="login-screen min-h-[100dvh] flex flex-col bg-[#fffaf0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Public+Sans:wght@400;500;600;700&display=swap');
        .login-screen { font-family: 'Public Sans', sans-serif; }
        .login-display { font-family: 'Oswald', sans-serif; }
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-fade-brand { animation: loginFadeUp 0.55s ease-out both; }
        .login-fade-form { animation: loginFadeUp 0.55s ease-out 0.12s both; }
      `}</style>

      <section
        className="relative flex min-h-[42vh] flex-col items-center justify-center overflow-hidden px-5 pb-12 pt-10 text-center sm:min-h-[48vh] sm:pb-16 sm:pt-14"
        style={{
          backgroundImage: `
            linear-gradient(165deg, rgba(120,53,15,0.96) 0%, rgba(217,119,6,0.9) 55%, rgba(154,52,18,0.95) 100%),
            url('/c08.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/c08.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="login-fade-brand relative z-10 mx-auto max-w-3xl">
          <img
            src="/cong-an-hieu.png"
            alt="Biểu trưng Công an nhân dân"
            className="mx-auto mb-5 w-[76px] object-contain drop-shadow-lg sm:w-24"
          />
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-100 sm:text-xl">
            {HEADER_1}
          </p>
          <h1 className="login-display text-2xl font-semibold uppercase leading-tight tracking-wide text-white sm:text-4xl lg:text-[2.75rem]">
            {HEADER_2}
          </h1>
          <div className="mx-auto mb-5 mt-4 h-0.5 w-14 rounded-full bg-amber-200" />
          <p className="mx-auto max-w-2xl text-[13px] leading-relaxed text-amber-50 sm:text-base">
            Ứng dụng công nghệ thông tin trong công tác tuyên truyền, phổ biến,
            giáo dục pháp luật về trật tự an toàn giao thông
          </p>
        </div>
      </section>

      <section className="flex flex-1 flex-col bg-[#fffaf0] px-4 py-8 sm:px-6 sm:py-10">
        <div className="login-fade-form mx-auto w-full max-w-lg">
          <div className="mb-6 text-center">
            <h2 className="login-display text-xl font-semibold uppercase tracking-wide text-[#9a3412] sm:text-2xl">
              Đổi mật khẩu
            </h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Xác thực tài khoản và nhập mật khẩu mới
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-4"
            noValidate
          >
            <TextField
              label="Tên tài khoản"
              variant="outlined"
              fullWidth
              autoComplete="username"
              disabled={isSubmitting}
              error={Boolean(form.formState.errors.tentaikhoan)}
              helperText={form.formState.errors.tentaikhoan?.message}
              sx={fieldSx}
              {...usernameField}
              onChange={(event) => {
                usernameField.onChange(event);
                setError("");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: BRAND }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Mật khẩu cũ"
              variant="outlined"
              fullWidth
              type={visiblePasswords.current ? "text" : "password"}
              autoComplete="current-password"
              disabled={isSubmitting}
              error={Boolean(form.formState.errors.matkhau)}
              helperText={form.formState.errors.matkhau?.message}
              sx={fieldSx}
              {...currentPasswordField}
              onChange={(event) => {
                currentPasswordField.onChange(event);
                setError("");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: BRAND }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={visiblePasswords.current ? "Ẩn mật khẩu cũ" : "Hiện mật khẩu cũ"}
                      onClick={() => togglePassword("current")}
                      edge="end"
                      size="small"
                      disabled={isSubmitting}
                    >
                      {visiblePasswords.current ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Mật khẩu mới"
              variant="outlined"
              fullWidth
              type={visiblePasswords.next ? "text" : "password"}
              autoComplete="new-password"
              disabled={isSubmitting}
              error={Boolean(form.formState.errors.matkhaumoi)}
              helperText={form.formState.errors.matkhaumoi?.message}
              sx={fieldSx}
              {...newPasswordField}
              onChange={(event) => {
                newPasswordField.onChange(event);
                setError("");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: BRAND }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={visiblePasswords.next ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"}
                      onClick={() => togglePassword("next")}
                      edge="end"
                      size="small"
                      disabled={isSubmitting}
                    >
                      {visiblePasswords.next ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <p role="alert" className="text-center text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
              sx={{
                mt: 1,
                py: 1.35,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
                backgroundColor: BRAND,
                boxShadow: "0 6px 16px rgba(217, 119, 6, 0.28)",
                "&:hover": {
                  backgroundColor: BRAND_DARK,
                  boxShadow: "0 8px 20px rgba(154, 52, 18, 0.3)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#e5ad58",
                  color: "#fff",
                },
              }}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                  Đang xử lý...
                </span>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>

            <Link
              to="/login"
              className="block text-right text-sm font-semibold text-[#9a3412] underline decoration-amber-600/50 underline-offset-2 hover:text-[#7c2d12]"
            >
              Quay lại đăng nhập
            </Link>
          </form>

          <footer className="mt-10 space-y-1 border-t border-amber-200/80 pt-5 text-center text-xs leading-relaxed text-slate-500 sm:text-[13px]">
            <p className="font-semibold uppercase">
              {/* Ứng dụng do Cục C08 và Công an tỉnh Hưng Yên triển khai thực hiện */}
              Ứng dụng do Công an tỉnh Hưng Yên triển khai thực hiện
            </p>
            <p>© 2026 — Tuyên truyền, đánh giá nhận thức, kiến thức pháp luật về trật tự, an toàn giao thông</p>
          </footer>
        </div>
      </section>
    </div>
  );
}

export default ChangePassPage;
