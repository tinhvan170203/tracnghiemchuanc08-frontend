import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";

const TableUser = ({
  userList,
  userTemp,
  page,
  onClickOpenDialogDelete,
  onClickSettingRoleUser,
}) => {
  const roles = useSelector((state) =>(state.authReducer.roles_x01));

  return (
    <Box mt={4}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                style={{ fontSize: "14px" }}
              >
                #
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "14px" }}
              >
                Tên tài khoản
              </TableCell>
              {/* <TableCell
                align="left"
                style={{ fontSize: "14px" }}
              >
                Mật khẩu
              </TableCell> */}
              <TableCell
                align="left"
                style={{ fontSize: "14px" }}
              >
                Thứ tự
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "14px" }}
              >
                Quyền hệ thống
              </TableCell>
              <TableCell
                align="right"
                style={{ fontSize: "14px" }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user, index) => (
              <TableRow
                className={
                  userTemp && user._id === userTemp._id ? "bg-gray-300" : ""
                }
                key={user._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {(page - 1) * 5 + 1 + index}
                </TableCell>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  {user.tentaikhoan}
                </TableCell>
                {/* <TableCell align="left">{user.matkhau}</TableCell> */}
                <TableCell align="left">{user.thutu}</TableCell>
                <TableCell align="left">{user.roles.toString()}</TableCell>
                <TableCell
                  align="right"
                  style={{
                    minWidth: "200px",
                  }}
                >
                  {roles && roles.includes("sửa tài khoản") && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => onClickSettingRoleUser(user)}
                      size="small"
                    >
                      <EditIcon
                        style={{ fontSize: "20px", marginRight: "4px" }}
                      />{" "}
                      Phân quyền
                    </Button>
                 )} 

                  {roles && roles.includes("xóa tài khoản") && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      style={{ marginTop: "4px" }}
                      onClick={() => onClickOpenDialogDelete(user._id)}
                      disabled={userTemp && user._id === userTemp._id}
                    >
                      <DeleteOutlineIcon
                        style={{ fontSize: "20px", marginRight: "4px" }}
                      />{" "}
                      Xóa
                    </Button>
                  )} 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableUser;
