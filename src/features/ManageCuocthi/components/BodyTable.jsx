import * as React from "react";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuItemFunc from "./MenuItemFunc";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useSelector } from "react-redux";


const BodyTable = ({
  row,
  onClickOpenDialogEdit,
  onClickOpenDialogDelete,
  onHandleChangeStatusCuocthi,
  onExportExcel,
  exportingId,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const roles = useSelector((state) => state.authReducer.roles_x01);

  return (
    <TableRow key={row._id}>
      <TableCell
        className="border-r border-slate-300"
        align="left"
        style={{ fontWeight: "bold" }}
      >
        {row._id}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
        style={{ fontWeight: "bold" }}
      >
        {row.tencuocthi}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.soluongcauhoi} (câu)
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
       {row.thoigianthi} (phút)
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
        style={{ fontWeight: "bold" }}
      >
        {dayjs(row.ngaytochucthi).format("DD/MM/YYYY")}
      </TableCell>
      {/* <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.password}
      </TableCell> */}
      <TableCell
        className="border-r border-slate-300"
        align="left"
        style={{color: "red" }}
      >
        {row.status === true ? (<span className="text-green-600 font-bold">Đang diễn ra</span>) : 'Không diễn ra'}
      </TableCell>
      <TableCell
        align="right"
        className="bg-gray-300 flex justify-center items-center space-x-1"
        style={{width: "250px",}}
      >
        {roles && roles.includes("sửa cuộc thi") && (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => onClickOpenDialogEdit(row)}
          >
            <EditIcon style={{ fontSize: "20px" }} />
          </Button>
        )}

        {roles && roles.includes("xóa cuộc thi") && (
          <Button
            variant="contained"
            color="error"
            size="small"
            style={{ marginLeft: "4px" }}
            onClick={() => onClickOpenDialogDelete(row._id)}
          >
            <DeleteOutlineIcon style={{ fontSize: "20px" }} />
          </Button>
        )}

        {roles && roles.includes("xem cuộc thi") && (
          <Button
            variant="contained"
            color="warning"
            size="small"
            style={{ marginLeft: "4px" }}
            disabled={exportingId === row._id}
            onClick={() => onExportExcel && onExportExcel(row)}
          >
            <FileDownloadIcon style={{ fontSize: "20px" }} />
            {exportingId === row._id ? "Đang tải..." : ""}
          </Button>
        )}

        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertOutlinedIcon  />
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItemFunc 
          onClose={handleClose} 
          onHandleChangeStatusCuocthi={onHandleChangeStatusCuocthi}
            row={row} 
          />
          {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem> */}
        </Menu>
      </TableCell>
    </TableRow>
  );
};

export default BodyTable;
