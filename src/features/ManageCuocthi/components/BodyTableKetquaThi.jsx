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

import { useSelector } from "react-redux";

function msToHMS( ms ) {
    // Đảm bảo ms không âm
    if (ms < 0) ms = 0;

    // 1- Chuyển sang giây:
    let seconds = ms / 1000;
    
    // 2- Trích xuất giờ:
    const hours = Math.floor( seconds / 3600 ); // 3,600 giây trong 1 giờ
    seconds = seconds % 3600; // số giây còn lại sau khi trích xuất giờ
    
    // 3- Trích xuất phút:
    const minutes = Math.floor( seconds / 60 ); // 60 giây trong 1 phút
    
    // 4- Giữ lại giây:
    seconds = seconds % 60;

    // Làm tròn giây và đảm bảo có 2 chữ số (ví dụ: 05)
    const formattedSeconds = seconds.toFixed(0).padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    if(hours === 0){
        return `${formattedMinutes} : ${formattedSeconds}`
    }
    // Định dạng đầy đủ: HH:MM:SS
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
const BodyTableKetquaThi = ({ row, index,page, rowsPerPage, onClickOpenDialogEdit }) => {
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
    <TableRow key={index}>
      <TableCell
        className="border-r border-slate-300"
        align="left"
        style={{ fontWeight: "bold" }}
      >
         {page * rowsPerPage + index + 1}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row?.thongtinthisinh.name}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
         {/* {dayjs(row?.thongtinthisinh.birthday).format('DD/MM/YYYY')} */}
        {row?.thongtinthisinh.birthday}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row?.thongtinthisinh.phone}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row?.thongtinthisinh.donvi}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row?.thongtinthisinh.hokhau}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row?.socaudung}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {/* {msToHMS(row?.time)} */} {row?.time < 0 ? "" : row.time}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
        // style={{ fontWeight: "bold" }}
      >
       {row?.rank}
      </TableCell>
      
      <TableCell
        align="right"
        className="bg-gray-300 flex justify-center items-center space-x-1"
      >
        {roles && roles.includes("sửa câu hỏi") && (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => onClickOpenDialogEdit(row)}
          >
            <EditIcon style={{ fontSize: "20px" }} />
            Xem bài thi
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default BodyTableKetquaThi;
