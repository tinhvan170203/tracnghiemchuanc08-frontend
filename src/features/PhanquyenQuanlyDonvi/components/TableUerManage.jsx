import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";

const headSx = {
  fontSize: 13,
  fontWeight: 700,
  color: "#fff",
  bgcolor: "#1e3a5f",
  py: 1.25,
  whiteSpace: "nowrap",
};

const TableUserManage = ({
  userList,
  userTemp,
  page,
  onClickSettingRoleUser,
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
            <TableCell sx={headSx}>Kiến thức được quản lý</TableCell>
            <TableCell align="right" sx={headSx}>
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                <Typography color="text.secondary" variant="body2">
                  Chưa có tài khoản nào.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            userList.map((user, index) => {
              const selected = userTemp && user._id === userTemp._id;
              const monthiList = (user.quantrinhomdonvi || []).map(
                (i) => i.tenmonthi
              );

              return (
                <TableRow
                  key={user._id}
                  sx={{
                    bgcolor: selected ? "rgba(37, 99, 235, 0.08)" : "transparent",
                    "&:hover": {
                      bgcolor: selected ? "rgba(37, 99, 235, 0.12)" : "#f8fafc",
                    },
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
                  <TableCell sx={{ maxWidth: 320 }}>
                    {monthiList.length > 0 ? (
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {monthiList.slice(0, 3).map((name) => (
                          <Chip
                            key={name}
                            label={name}
                            size="small"
                            sx={{
                              bgcolor: "#fff7ed",
                              color: "#c2410c",
                              fontWeight: 600,
                              maxWidth: 140,
                            }}
                          />
                        ))}
                        {monthiList.length > 3 && (
                          <Chip
                            label={`+${monthiList.length - 3}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Chưa phân quyền
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {roles && roles.includes("sửa phân quyền quản lý môn thi") && (
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

export default TableUserManage;
