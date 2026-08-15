import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import BodyTableKetquaThi from "./BodyTableKetquaThi";

const headCellSx = {
  fontSize: "14px",
  color: "#fff",
  padding: "8px 8px",
  backgroundColor: "#1976d2",
  whiteSpace: "nowrap",
};

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTableKetquaThi({
  list,
  onClickOpenDialogEdit,
  cuocthi,
  total = 0,
  page = 0,
  rowsPerPage = 20,
  onPageChange,
  onRowsPerPageChange,
}) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={headCellSx}>STT</TableCell>
              <TableCell align="left" style={headCellSx}>Xếp hạng</TableCell>
              <TableCell align="left" style={{ ...headCellSx, minWidth: "150px" }}>Họ tên</TableCell>
              <TableCell align="left" style={headCellSx}>Năm sinh</TableCell>
              <TableCell align="left" style={headCellSx}>Giới tính</TableCell>
              <TableCell align="left" style={headCellSx}>Loại xe</TableCell>
              <TableCell align="left" style={headCellSx}>Hạng GPLX</TableCell>
              {/* <TableCell align="left" style={headCellSx}>Nghề nghiệp</TableCell> */}
              <TableCell align="left" style={headCellSx}>Địa chỉ</TableCell>
              <TableCell align="left" style={headCellSx}>SĐT</TableCell>
              {/* <TableCell align="left" style={headCellSx}>Hộ khẩu</TableCell> */}
              <TableCell align="left" style={headCellSx}>Số câu đúng</TableCell>
              <TableCell align="left" style={headCellSx}>Xếp loại</TableCell>
              <TableCell align="left" style={headCellSx}>T/gian</TableCell>
              {/* <TableCell align="left" style={headCellSx}>Kết thúc</TableCell>
              <TableCell align="left" style={headCellSx}>Thời gian làm bài</TableCell> */}
              <TableCell align="center" style={headCellSx}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row, index) => (
              <BodyTableKetquaThi
                row={row}
                page={page}
                rowsPerPage={rowsPerPage}
                cuocthi={cuocthi}
                key={row._id || index}
                index={index}
                onClickOpenDialogEdit={onClickOpenDialogEdit}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              "aria-label": "rows per page",
            },
            native: true,
          }}
          component={"div"}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          ActionsComponent={TablePaginationActions}
          labelRowsPerPage="Số bản ghi hiển thị trên mỗi trang"
          labelDisplayedRows={function defaultLabelDisplayedRows({
            from,
            to,
            count,
          }) {
            return `hiển thị ${from} đến ${to} bản ghi trong tổng số ${
              count !== -1 ? count : `more than ${to}`
            } bản ghi`;
          }}
        />
      </div>
    </>
  );
}
