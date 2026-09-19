import React, { useEffect, useState } from "react";
import { TableRow, TableCell } from "@mui/material";

const ACTION_SLOTS = 4; // Xem | Thêm | Sửa | Xóa — luôn đủ cột cho thẳng hàng

export default function RoleList({ label, values, onChangeRoleList, userTemp }) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setRoles(values);
  }, []);

  useEffect(() => {
    if (userTemp) {
      let newState = [];
      values.forEach((i) => {
        if (userTemp.roles.includes(i.name)) {
          newState.push({
            name: i.name,
            isChecked: true,
          });
        } else {
          newState.push({
            name: i.name,
            isChecked: false,
          });
        }
      });
      setRoles(newState);
    } else {
      setRoles(values);
    }
  }, [userTemp]);

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "allSelect") {
      let tempRole = roles.map((role) => {
        return { ...role, isChecked: checked };
      });
      setRoles(tempRole);
      let checkedFilter = [];
      let unCheckedFilter = [];

      tempRole.forEach((i) => {
        if (i.isChecked === true) {
          checkedFilter.push(i.name);
        } else {
          unCheckedFilter.push(i.name);
        }
      });

      onChangeRoleList(checkedFilter, unCheckedFilter);
    } else {
      let tempRole = roles.map((role) =>
        role.name === name ? { ...role, isChecked: checked } : role
      );
      setRoles(tempRole);
      let checkedFilter = [];
      let unCheckedFilter = [];

      tempRole.forEach((i) => {
        if (i.isChecked === true) {
          checkedFilter.push(i.name);
        } else {
          unCheckedFilter.push(i.name);
        }
      });
      onChangeRoleList(checkedFilter, unCheckedFilter);
    }
  };

  const slots = Array.from({ length: ACTION_SLOTS }, (_, index) => roles[index] || null);

  return (
    <TableRow
      sx={{
        "&:nth-of-type(even)": { bgcolor: "#f8fafc" },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell
        component="th"
        scope="row"
        sx={{ py: 1, px: 1.25, minWidth: 180 }}
      >
        <span className="font-semibold text-[13px] text-slate-700">{label}</span>
      </TableCell>
      {slots.map((role, index) => (
        <TableCell
          align="center"
          key={role?.name || `empty-${index}`}
          sx={{ py: 1, px: 0.5 }}
        >
          {role ? (
            <input
              type="checkbox"
              checked={role?.isChecked || false}
              name={role.name}
              onChange={handleChange}
              className="h-4 w-4 accent-blue-600 cursor-pointer"
            />
          ) : null}
        </TableCell>
      ))}

      <TableCell align="center" sx={{ py: 1, px: 0.5 }}>
        <input
          type="checkbox"
          checked={
            roles.length > 0 &&
            roles.filter((role) => role?.isChecked !== true).length < 1
          }
          name="allSelect"
          value="allSelect"
          onChange={handleChange}
          className="h-4 w-4 accent-blue-600 cursor-pointer"
        />
      </TableCell>
    </TableRow>
  );
}
