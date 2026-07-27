import * as React from "react";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useSelector } from "react-redux";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from "@mui/material";


const BodyTable = ({
  row,
  onClickOpenDialogEdit,
  onClickOpenDialogDelete,
  onViewPlayer
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
        {row.thutu}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.name}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.mota}
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.nameFile} <span className="text-gray-600">{!row.is_source_link_orther ? row.sizeFile : row.link_orther}</span> 
       <IconButton onClick={()=>onViewPlayer(row)}><PlayArrowIcon className="text-green-700"/></IconButton> 
      </TableCell>
      <TableCell
        className="border-r border-slate-300"
        align="left"
      >
        {row.totalView} 
      </TableCell>
     
      <TableCell
        align="right"
        className="bg-gray-300 flex justify-center items-center space-x-1"
        style={{width: "180px",}}
      >
     
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => onClickOpenDialogEdit(row)}
          >
            <EditIcon style={{ fontSize: "20px" }} />
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            style={{ marginLeft: "4px" }}
            onClick={() => onClickOpenDialogDelete(row._id)}
          >
            <DeleteOutlineIcon style={{ fontSize: "20px" }} />
          </Button>
      </TableCell>
    </TableRow>
  );
};

export default BodyTable;
