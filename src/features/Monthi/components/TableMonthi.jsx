import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Switch } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TableMonthi = ({
  donviList,
  page,
  onClickOpenDialogDelete, 
  onClickOpenDialogEditDonvi,
  onToggleHoctap,
  tongbanghi
}) => {
  const roles = useSelector((state) => (state.authReducer.roles_x01));

  const navigate = useNavigate()
 
  return (
    <Box mt={4}>
      <p className="text-end my-2">Tổng cộng có: <span className="text-xl font-bold">{tongbanghi}</span> bản ghi</p>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{backgroundColor: "#1976d2"}}>
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
                Kiến thức đánh giá
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                Mô tả
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                Thứ tự
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                Id cuộc thi tự kiểm tra học tập
              </TableCell>
              <TableCell
                align="center"
                style={{ fontSize: "14px",color: "#fff", padding: "8px 8px" }}
              >
                Hiện tự học
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
            {donviList.map((donvi, index) => (
              <TableRow
                key={donvi._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {(page - 1) * 5 + 1 + index}
                </TableCell>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  {donvi.tenmonthi}
                </TableCell>
                <TableCell align="left">{donvi.mota}</TableCell>
                <TableCell align="left">{donvi.thutu}</TableCell>
                <TableCell align="left">{donvi.link_test}</TableCell>
                <TableCell align="center">
                  {roles && roles.includes("sửa môn thi") ? (
                    <Switch
                      checked={!!donvi.hien_thi_hoctap}
                      onChange={(e) => onToggleHoctap(donvi, e.target.checked)}
                      color="success"
                    />
                  ) : (
                    donvi.hien_thi_hoctap ? "Có" : "Không"
                  )}
                </TableCell>
                <TableCell
                  align="right"
                >
                  {roles && roles.includes("sửa môn thi") && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => onClickOpenDialogEditDonvi(donvi)}
                    >
                      <EditIcon
                        style={{ fontSize: "20px", marginRight: "4px" }}
                      />{" "}
                      Sửa
                    </Button>
                 )} 

                  {roles && roles.includes("xóa môn thi") && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      style={{ marginLeft: "4px" }}
                      onClick={() => onClickOpenDialogDelete(donvi._id)}
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

export default TableMonthi;
