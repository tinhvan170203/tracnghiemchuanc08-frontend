import { MenuItem } from "@mui/material";
import React from "react";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import SettingsIcon from "@mui/icons-material/Settings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ViewListIcon from "@mui/icons-material/ViewList";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate, NavLink } from "react-router-dom";
import GroupIcon from '@mui/icons-material/Group';
import { useSelector } from "react-redux";

const MenuItemFunc = ({ onClose, row,onHandleChangeStatusCuocthi
}) => {
  const navigate = useNavigate();
  
  const handleChangeStatus =  async() => {
    await onHandleChangeStatusCuocthi(row._id);
    onClose()
  }
  const roles = useSelector((state) => state.authReducer.roles_x01);
  return (
    <>
      {/* <h3 className="text-center p-2 px-4 text-black font-medium">
        Quản trị cuộc thi trắc nghiệm " {row.tencuocthi} "
      </h3> */}
      <hr></hr>
      {/* {roles && roles.includes("xem thí sinh") && (
      <MenuItem onClick={() => navigate(`/admin/cuoc-thi/${row._id}/thi-sinh`)}>
        <div className="flex items-center justify-between space-x-4 hover:bg-slate-200 p-1 rounded-md w-full">
          <GroupIcon color="primary" />
          <span className="text-sm">Thí sinh dự thi</span>
        </div>
      </MenuItem>
      )} */}
      {/* <MenuItem onClick={() => navigate(`/admin/ket-qua-thi/cuoc-thi/${row._id}`)}>
        <div className="flex items-center justify-between space-x-4 hover:bg-slate-200 p-1 rounded-md w-full">
          <MilitaryTechIcon color="primary" />
          <span className="text-sm">Kết quả thi</span>
        </div>
      </MenuItem> */}
      <NavLink
  to={`/admin/ket-qua-thi/cuoc-thi/${row._id}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <MenuItem>
    <div className="flex items-center justify-between space-x-4 hover:bg-slate-200 p-1 rounded-md w-full">
          <MilitaryTechIcon color="primary" />
          <span className="text-sm">Kết quả thi</span>
        </div>
  </MenuItem>
</NavLink>
      {roles && roles.includes("sửa trạng thái cuộc thi") && (
      <MenuItem onClick={() => handleChangeStatus()}>
        <div className="flex items-center justify-between space-x-4 hover:bg-slate-200 p-1 rounded-md w-full">
          <SettingsIcon color="primary" />
          <span className="text-sm">Thay đổi trạng thái thi</span>
        </div>
      </MenuItem>
      )}
    </>
  );
};

export default MenuItemFunc;
