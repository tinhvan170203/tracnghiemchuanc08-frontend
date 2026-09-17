import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

/**
 * Chặn vào trang admin nếu thiếu quyền (role string hoặc mảng — đủ 1 quyền là vào được).
 */
export default function RequireRole({ role, children }) {
  const roles = useSelector((state) => state.authReducer.roles_x01);
  const sessionChecked = useSelector((state) => state.authReducer.sessionChecked);
  const sessionValid = useSelector((state) => state.authReducer.sessionValid);

  if (!sessionChecked) {
    return null;
  }

  if (!sessionValid) {
    return <Navigate to="/login" replace />;
  }

  const required = Array.isArray(role) ? role : [role];
  const allowed =
    roles && required.some((r) => r && roles.includes(r));

  if (!allowed) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          px: 2,
          textAlign: "center",
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 48, color: "text.secondary" }} />
        <Typography fontWeight={700}>Không có quyền truy cập</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          Tài khoản chưa được cấp quyền phù hợp cho chức năng này. Liên hệ quản trị
          viên để được phân quyền.
        </Typography>
        <Button href="/admin" variant="contained" sx={{ mt: 1, textTransform: "none" }}>
          Về trang quản trị
        </Button>
      </Box>
    );
  }

  return children;
}
