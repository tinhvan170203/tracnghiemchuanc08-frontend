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

const TableBacHam = ({
  list,
  page,
  onClickOpenDialogDelete, 
  onClickOpenDialogEdit,
  tongbanghi
}) => {
  const roles = useSelector((state) => (state.authReducer.roles_x01));
 
  return (
    <Box mt={4}>
      <p className="text-end my-2">Tổng cộng có: <span className="text-xl font-bold">{tongbanghi}</span> bản ghi</p>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{backgroundColor: "#ed6c02"}}>
            <TableRow>
              <TableCell
                align="left"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                #
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                Tên cấp bậc hàm
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                Niên hạn lên hàm kế tiếp ( tính theo năm )
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                Thứ tự
              </TableCell>
              <TableCell
                align="right"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item, index) => (
              <TableRow
                key={item._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {(page - 1) * 5 + 1 + index}
                </TableCell>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  {item.capham}
                </TableCell>
                <TableCell align="left">{item.nienhanlenham}</TableCell>
                <TableCell align="left">{item.thutu}</TableCell>
                <TableCell
                  align="right"
                >
                  {roles && roles.includes("sửa quân hàm") && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => onClickOpenDialogEdit(item)}
                    >
                      <EditIcon
                        style={{ fontSize: "20px", marginRight: "4px" }}
                      />{" "}
                      Sửa
                    </Button>
                 )} 

                  {roles && roles.includes("xóa quân hàm") && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      style={{ marginLeft: "4px" }}
                      onClick={() => onClickOpenDialogDelete(item._id)}
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

export default TableBacHam;
