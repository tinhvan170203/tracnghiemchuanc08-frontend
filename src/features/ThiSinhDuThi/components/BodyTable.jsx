import * as React from "react";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useSelector } from "react-redux";


const BodyTable = ({
  row,
  onClickOpenDialogEdit,
  onClickOpenDialogDelete,
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
        {row.sbd}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
        style={{ fontWeight: "bold" }}
      >
        {row.hoten}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.namsinh}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.capbac}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.chucvu}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.donvi.kyhieu}
      </TableCell>
      <TableCell
        align="right"
        className="bg-gray-300 flex justify-center items-center space-x-1"
        style={{width: "180px",}}
      >
        {roles && roles.includes("sửa thí sinh") && (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => onClickOpenDialogEdit(row)}
          >
            <EditIcon style={{ fontSize: "20px" }} />
          </Button>
        )}

        {roles && roles.includes("xóa thí sinh") && (
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
