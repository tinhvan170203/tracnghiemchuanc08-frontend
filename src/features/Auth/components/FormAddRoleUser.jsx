import {
  Button,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import RoleList from "./RoleList";
import SecurityIcon from "@mui/icons-material/Security";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

const headSx = {
  fontSize: 12,
  fontWeight: 700,
  color: "#fff",
  bgcolor: "#1e3a5f",
  py: 1,
  px: 1,
  whiteSpace: "nowrap",
};

export default function FormAddRoleUser({
  userTemp,
  onHandleEditUser,
  onClearUser,
}) {
  let roleListTemp = [];

  const [roleList, setRoleList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRoleList(userTemp !== null ? userTemp.roles : []);
  }, [userTemp]);

  const handleSubmitSettingRoles = async () => {
    let data = {
      id_edit: userTemp._id,
      roles: roleList,
    };
    setLoading(true);
    await onHandleEditUser(data);
    setLoading(false);
    setRoleList([]);
  };

  const handleChangeRoleList = (checkedFilter, unCheckedFilter) => {
    roleListTemp = roleList;

    if (unCheckedFilter.length > 0) {
      unCheckedFilter.forEach((e) => {
        let index = roleListTemp.findIndex((el) => el === e);
        if (index !== -1) {
          roleListTemp.splice(index, 1);
        }
      });
    }
    roleListTemp = roleListTemp.concat(checkedFilter);
    roleListTemp = Array.from(new Set(roleListTemp));
    setRoleList(roleListTemp);
  };

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
            Phân quyền tài khoản
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
              Chọn tài khoản và bấm &quot;Phân quyền&quot; để chỉnh sửa
            </Typography>
          )}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 1.5 }}>
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
          onClick={handleSubmitSettingRoles}
          disabled={userTemp === null || loading}
          startIcon={<SaveOutlinedIcon />}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            minHeight: 36,
          }}
        >
          Cập nhật
        </Button>
      </Stack>

      <TableContainer
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          maxHeight: { xs: 420, lg: "70vh" },
          overflow: "auto",
          bgcolor: "#fff",
          opacity: userTemp ? 1 : 0.55,
          pointerEvents: userTemp ? "auto" : "none",
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headSx}>Nhóm quyền</TableCell>
              <TableCell align="center" sx={headSx}>
                Xem
              </TableCell>
              <TableCell align="center" sx={headSx}>
                Thêm
              </TableCell>
              <TableCell align="center" sx={headSx}>
                Sửa
              </TableCell>
              <TableCell align="center" sx={headSx}>
                Xóa
              </TableCell>
              <TableCell align="center" sx={headSx}>
                Full
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <RoleList
              label="QL tài khoản"
              values={[
                { name: "xem tài khoản" },
                { name: "thêm tài khoản" },
                { name: "sửa tài khoản" },
                { name: "xóa tài khoản" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="Reset mật khẩu"
              values={[
                { name: "reset mật khẩu" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="Phân quyền QL kiến thức đánh giá"
              values={[
                { name: "xem phân quyền quản lý môn thi" },
                { name: "thêm phân quyền quản lý môn thi" },
                { name: "sửa phân quyền quản lý môn thi" },
                { name: "xóa phân quyền quản lý môn thi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="QL kiến thức đánh giá"
              values={[
                { name: "xem môn thi" },
                { name: "thêm môn thi" },
                { name: "sửa môn thi" },
                { name: "xóa môn thi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="QL chuyên đề đánh giá"
              values={[
                { name: "xem chuyên đề" },
                { name: "thêm chuyên đề" },
                { name: "sửa chuyên đề" },
                { name: "xóa chuyên đề" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="QL cuộc đánh giá"
              values={[
                { name: "xem cuộc thi" },
                { name: "thêm cuộc thi" },
                { name: "sửa cuộc thi" },
                { name: "xóa cuộc thi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="Quản trị tất cả cuộc đánh giá"
              values={[
                { name: "quản trị tất cả cuộc đánh giá" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="QL câu hỏi"
              values={[
                { name: "xem câu hỏi" },
                { name: "thêm câu hỏi" },
                { name: "sửa câu hỏi" },
                { name: "xóa câu hỏi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="Trạng thái cuộc đánh giá"
              values={[
                { name: "xem trạng thái cuộc thi" },
                { name: "thêm trạng thái cuộc thi" },
                { name: "sửa trạng thái cuộc thi" },
                { name: "xóa trạng thái cuộc thi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="Video tuyên truyền"
              values={[
                { name: "xem video tuyên truyền" },
                { name: "thêm video tuyên truyền" },
                { name: "sửa video tuyên truyền" },
                { name: "xóa video tuyên truyền" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="Cẩm nang giao thông"
              values={[
                { name: "xem cẩm nang giao thông" },
                { name: "thêm cẩm nang giao thông" },
                { name: "sửa cẩm nang giao thông" },
                { name: "xóa cẩm nang giao thông" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="Tài liệu kiến thức AI"
              values={[
                { name: "xem tài liệu AI" },
                { name: "thêm tài liệu AI" },
                { name: "sửa tài liệu AI" },
                { name: "xóa tài liệu AI" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
