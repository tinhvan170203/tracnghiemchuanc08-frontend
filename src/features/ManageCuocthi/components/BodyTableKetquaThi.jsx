import * as React from "react";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";

import { useSelector } from "react-redux";

function msToHMS(ms) {
  if (ms == null || ms < 0) return "";

  let seconds = ms / 1000;
  const hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  const formattedSeconds = seconds.toFixed(0).padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  if (hours === 0) {
    return `${formattedMinutes} : ${formattedSeconds}`;
  }
  const formattedHours = hours.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function formatTs(ts) {
  if (!ts) return "";
  return dayjs(Number(ts)).format("DD/MM/YYYY HH:mm:ss");
}

const cellClass = "border-r border-slate-300";

const BodyTableKetquaThi = ({ row, index, page, rowsPerPage, onClickOpenDialogEdit }) => {
  const roles = useSelector((state) => state.authReducer.roles_x01);
  const tt = row?.thongtinthisinh || {};

  return (
    <TableRow key={index}>
      <TableCell className={cellClass} align="left" style={{ fontWeight: "bold" }}>
        {page * rowsPerPage + index + 1}
      </TableCell>
      <TableCell className={cellClass} align="left">{row?.rank}</TableCell>
      <TableCell className={cellClass} align="left">{tt.name}</TableCell>
      <TableCell className={cellClass} align="left">{tt.birthday}</TableCell>
      <TableCell className={cellClass} align="left">{tt.gioitinh}</TableCell>
      <TableCell className={cellClass} align="left">{tt.loaixe}</TableCell>
      <TableCell className={cellClass} align="left">{tt.hang_gplx}</TableCell>
      {/* <TableCell className={cellClass} align="left">{tt.nghenghiep}</TableCell> */}
      <TableCell className={cellClass} align="left">{tt.phone} - {tt.hokhau}</TableCell>
      <TableCell className={cellClass} align="left">{tt.donvi}</TableCell>
      {/* <TableCell className={cellClass} align="left">{tt.hokhau}</TableCell> */}
      <TableCell className={cellClass} align="left">{row?.socaudung}</TableCell>
      <TableCell className={cellClass} align="left">{row?.xeploai}</TableCell>
      {/* <TableCell className={cellClass} align="left">{formatTs(row?.thoigianbatdau)}</TableCell>
      <TableCell className={cellClass} align="left">{formatTs(row?.thoigiannopbai)}</TableCell> */}
      <TableCell className={cellClass} align="left">
        {row?.time < 0 ? "" : msToHMS(row?.time)}
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
