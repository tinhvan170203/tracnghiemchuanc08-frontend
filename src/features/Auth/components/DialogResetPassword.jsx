import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function DialogResetPassword({
  open,
  user,
  loading,
  onClose,
  onSubmit,
}) {
  const [matkhauMoi, setMatkhauMoi] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setMatkhauMoi("");
      setConfirm("");
      setShowPass(false);
      setError("");
    }
  }, [open, user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pass = matkhauMoi.trim();
    if (pass.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (pass !== confirm.trim()) {
      setError("Xác nhận mật khẩu không khớp");
      return;
    }
    setError("");
    await onSubmit(pass);
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pr: 6, fontWeight: 700, fontSize: "1.05rem" }}>
        Reset mật khẩu
        <IconButton
          aria-label="Đóng"
          onClick={onClose}
          disabled={loading}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Đặt mật khẩu mới cho tài khoản{" "}
          <Typography component="span" fontWeight={700} color="text.primary">
            {user?.tentaikhoan || "—"}
          </Typography>
          . Người dùng sẽ dùng mật khẩu này để đăng nhập.
        </Typography>

        <Stack component="form" id="form-reset-password" onSubmit={handleSubmit} spacing={2}>
          <TextField
            label="Mật khẩu mới"
            type={showPass ? "text" : "password"}
            value={matkhauMoi}
            onChange={(e) => setMatkhauMoi(e.target.value)}
            size="small"
            fullWidth
            required
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPass((v) => !v)}
                    edge="end"
                  >
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type={showPass ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            size="small"
            fullWidth
            required
          />
          {error ? (
            <Typography variant="caption" color="error" fontWeight={600}>
              {error}
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none" }}>
          Hủy
        </Button>
        <Button
          type="submit"
          form="form-reset-password"
          variant="contained"
          disabled={loading}
          startIcon={<LockResetIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {loading ? "Đang lưu..." : "Reset mật khẩu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
