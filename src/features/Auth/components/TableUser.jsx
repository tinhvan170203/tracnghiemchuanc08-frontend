import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useSelector } from "react-redux";

const headSx = {
  fontSize: 13,
  fontWeight: 700,
  color: "#fff",
  bgcolor: "#1e3a5f",
  py: 1.25,
  whiteSpace: "nowrap",
};

const TableUser = ({
  userList,
  userTemp,
  page,
  onClickOpenDialogDelete,
  onClickSettingRoleUser,
  onClickResetPassword,
}) => {
  const roles = useSelector((state) => state.authReducer.roles_x01);

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflowX: "auto",
      }}
    >
      <Table sx={{ minWidth: 640 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={headSx}>#</TableCell>
            <TableCell sx={headSx}>Tên tài khoản</TableCell>
            <TableCell sx={headSx}>Thứ tự</TableCell>
            <TableCell sx={headSx}>Quyền hệ thống</TableCell>
            <TableCell align="right" sx={headSx}>
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                <Typography color="text.secondary" variant="body2">
                  Chưa có tài khoản nào.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            userList.map((user, index) => {
              const selected = userTemp && user._id === userTemp._id;
              return (
                <TableRow
                  key={user._id}
                  sx={{
                    bgcolor: selected ? "rgba(37, 99, 235, 0.08)" : "transparent",
                    "&:hover": { bgcolor: selected ? "rgba(37, 99, 235, 0.12)" : "#f8fafc" },
                    borderLeft: selected ? "3px solid #2563eb" : "3px solid transparent",
                  }}
                >
                  <TableCell sx={{ color: "text.secondary", width: 48 }}>
                    {(page - 1) * 5 + 1 + index}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={700} fontSize={14}>
                      {user.tentaikhoan}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.thutu}
                      size="small"
                      sx={{ fontWeight: 700, minWidth: 36 }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.4,
                      }}
                      title={(user.roles || []).toString()}
                    >
                      {(user.roles || []).length
                        ? user.roles.toString()
                        : "Chưa phân quyền"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={0.75}
                      justifyContent="flex-end"
                      alignItems="stretch"
                    >
                      {roles && roles.includes("sửa tài khoản") && (
                        <Button
                          variant={selected ? "contained" : "outlined"}
                          color="success"
                          onClick={() => onClickSettingRoleUser(user)}
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Phân quyền
                        </Button>
                      )}
                      {roles && roles.includes("reset mật khẩu") && (
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => onClickResetPassword(user)}
                          size="small"
                          startIcon={<LockResetIcon />}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Reset MK
                        </Button>
                      )}
                      {roles && roles.includes("xóa tài khoản") && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => onClickOpenDialogDelete(user._id)}
                          disabled={selected}
                          startIcon={<DeleteOutlineIcon />}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Xóa
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableUser;
