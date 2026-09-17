import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

export default function AddDonviManage({
  values,
  onHandleEdit,
  userTemp,
  onClearUser,
}) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRoles(values);
  }, [values]);

  useEffect(() => {
    if (userTemp) {
      const assignedIds = (userTemp.quantrinhomdonvi || []).map((i) => i._id);
      setRoles(
        values.map((i) => ({
          name: i.name,
          monthi: i.monthi,
          isChecked: assignedIds.includes(i.name),
        }))
      );
    } else {
      setRoles(values);
    }
  }, [userTemp, values]);

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "allSelect") {
      setRoles((prev) => prev.map((role) => ({ ...role, isChecked: checked })));
    } else {
      setRoles((prev) =>
        prev.map((role) =>
          role.name === name ? { ...role, isChecked: checked } : role
        )
      );
    }
  };

  const handleSubmit = async () => {
    const checkedArr = roles.filter((i) => i.isChecked).map((i) => i.name);

    const data = {
      id_edit: userTemp._id,
      quantrinhomdonvi: checkedArr,
    };

    setLoading(true);
    await onHandleEdit(data);
    setLoading(false);
  };

  const allChecked =
    roles.length > 0 && roles.every((role) => role.isChecked);
  const checkedCount = roles.filter((r) => r.isChecked).length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: userTemp ? "#93c5fd" : "divider",
        boxShadow: "0 4px 24px rgba(15, 23, 42, 0.05)",
        position: { lg: "sticky" },
        top: { lg: 16 },
        bgcolor: userTemp ? "#f8fbff" : "#fff",
      }}
    >
      {loading && <LinearProgress sx={{ mb: 1.5, borderRadius: 1 }} />}

      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: userTemp ? "#dbeafe" : "#f1f5f9",
            color: userTemp ? "#1d4ed8" : "#64748b",
            display: "flex",
          }}
        >
          <SecurityIcon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography fontWeight={700} fontSize="0.95rem">
            Kiến thức được quản lý
          </Typography>
          {userTemp ? (
            <Chip
              label={userTemp.tentaikhoan}
              size="small"
              color="primary"
              sx={{ mt: 0.75, fontWeight: 700 }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Chọn tài khoản và bấm &quot;Phân quyền&quot; để gán môn thi
            </Typography>
          )}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {userTemp
            ? `Đã chọn ${checkedCount}/${roles.length} môn`
            : `${roles.length} môn thi`}
        </Typography>
        <Stack direction="row" spacing={1}>
          {userTemp && (
            <Button
              size="small"
              color="inherit"
              onClick={onClearUser}
              sx={{ textTransform: "none" }}
            >
              Bỏ chọn
            </Button>
          )}
          <Button
            variant="contained"
            disabled={userTemp === null || loading}
            onClick={handleSubmit}
            startIcon={<SaveOutlinedIcon />}
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              minHeight: 36,
            }}
          >
            Lưu phân quyền
          </Button>
        </Stack>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          maxHeight: { xs: 420, lg: "70vh" },
          overflowY: "auto",
          opacity: userTemp ? 1 : 0.55,
          pointerEvents: userTemp ? "auto" : "none",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.25,
            bgcolor: "#1e3a5f",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={allChecked}
                indeterminate={checkedCount > 0 && !allChecked}
                name="allSelect"
                value="allSelect"
                onChange={handleChange}
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&.Mui-checked": { color: "#fff" },
                }}
              />
            }
            label={
              <Typography fontWeight={700} fontSize={13} color="#fff">
                Chọn tất cả
              </Typography>
            }
          />
        </Box>

        {roles.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có kiến thức đánh giá nào.
            </Typography>
          </Box>
        ) : (
          roles.map((role, idx) => (
            <Box
              key={role.name}
              sx={{
                px: 2,
                py: 1,
                borderBottom: idx < roles.length - 1 ? "1px solid #f1f5f9" : "none",
                bgcolor: role.isChecked ? "rgba(37, 99, 235, 0.06)" : idx % 2 === 0 ? "#fff" : "#f8fafc",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={role.isChecked || false}
                    name={role.name}
                    onChange={handleChange}
                    size="small"
                  />
                }
                label={
                  <Typography fontSize={14} fontWeight={role.isChecked ? 600 : 400}>
                    {role.monthi}
                  </Typography>
                }
                sx={{ m: 0, width: "100%" }}
              />
            </Box>
          ))
        )}
      </Paper>
    </Paper>
  );
}
