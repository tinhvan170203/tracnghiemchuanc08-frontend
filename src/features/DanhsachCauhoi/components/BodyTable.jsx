import * as React from "react";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useSelector } from "react-redux";
import Switch from "@mui/material/Switch";

const funcCompare = (value) => {
  if(value === "option_a"){
    return "A"
  };
  if(value === "option_b"){
    return "B"
  };
  if(value === "option_c"){
    return "C"
  };
  if(value === "option_d"){
    return "D"
  };
  if(value === "option_e"){
    return "E"
  };
}

const BodyTable = ({
  row,
  onClickOpenDialogEdit,
  onClickOpenDialogDelete,
  onToggleActive,
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
      >
        {row.question}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.chuyende.title}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.option_a}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.option_b}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.option_c}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.option_d}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.option_e}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
        style={{ fontWeight: "bold" }}
      >
        {funcCompare(row.answer)}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="center"
      >
        {roles && roles.includes("sửa câu hỏi") ? (
          <Switch
            checked={row.active !== false}
            onChange={(e) => onToggleActive(row, e.target.checked)}
            color="success"
          />
        ) : (
          row.active !== false ? "Có" : "Không"
        )}
      </TableCell>
      <TableCell
        align="right"
        className="bg-gray-300 flex justify-center items-center space-x-1"
        style={{width: "180px",}}
      >
        {roles && roles.includes("sửa câu hỏi") && (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => onClickOpenDialogEdit(row)}
          >
            <EditIcon style={{ fontSize: "20px" }} />
          </Button>
        )}

        {roles && roles.includes("xóa câu hỏi") && (
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
      </TableCell>
    </TableRow>
  );
};

export default BodyTable;
