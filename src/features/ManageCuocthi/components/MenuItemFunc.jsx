import { MenuItem } from "@mui/material";
import React from "react";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MenuItemFunc = ({ onClose, row, onHandleChangeStatusCuocthi }) => {
  const navigate = useNavigate();
  const roles = useSelector((state) => state.authReducer.roles_x01);

  const canChangeStatus =
    roles &&
    (roles.includes("sửa trạng thái cuộc thi") ||
      roles.includes("sửa cuộc thi"));

  const handleChangeStatus = async () => {
    await onHandleChangeStatusCuocthi(row._id);
    onClose();
  };

  const handleOpenKetqua = () => {
    onClose();
    navigate(`/admin/ket-qua-thi/cuoc-thi/${row._id}`);
  };

  return (
    <>
      <hr />
      <MenuItem onClick={handleOpenKetqua}>
        <div className="flex items-center justify-between space-x-4 hover:bg-slate-200 p-1 rounded-md w-full">
          <MilitaryTechIcon color="primary" />
          <span className="text-sm">Kết quả thi</span>
        </div>
      </MenuItem>
      {canChangeStatus && (
        <MenuItem onClick={handleChangeStatus}>
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
