import React, { useEffect, useState } from "react";
import { Paper, Button } from "@mui/material";

export default function AddDonviManage({ values, onHandleEdit, userTemp }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRoles(values);
  }, [values]);

  useEffect(() => {
    if (userTemp) {
      let newState = [];
      values.forEach((i) => {
        if (userTemp.quantrinhomdonvi.map(i=> i._id).includes(i.name)) {
          newState.push({
            name: i.name,
            monthi: i.monthi,
            isChecked: true,
          });
        } else {
          newState.push({
            name: i.name,
            monthi: i.monthi,
            isChecked: false,
          });
        }
      });
      setRoles(newState);
    } else {
      setRoles(values);
    }
  }, [userTemp]);
  //function change checkbox
  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "allSelect") {
      let tempRole = roles.map((role) => {
        return { ...role, isChecked: checked };
      });
      setRoles(tempRole);
    } else {
      let tempRole = roles.map((role) =>
        role.name === name ? { ...role, isChecked: checked } : role
      );
      setRoles(tempRole);
    }
  };

  const handleSubmit = async () => {
    let checkedArr = [];

    roles.forEach((i) => {
      if (i.isChecked === true) {
        checkedArr.push(i.name);
      }
    });

    let data = {
      id_edit: userTemp._id,
      quantrinhomdonvi: checkedArr
    }

    setLoading(true)
    await onHandleEdit(data)
    setLoading(false)
  };
  return (
    <div className="p-2">
      <Paper style={{ padding: "16px" }}>
        <h3 className="text-md text-center mt-2 font-bold">
          Nhóm kiến thức được quản lý {userTemp && (
            <>
              bởi tài khoản {userTemp.tentaikhoan}
            </>
          )}
        </h3>

        <div className="text-end mt-2">
          <Button
            variant="contained"
            size="small"
            disabled={userTemp === null || loading}
            onClick={handleSubmit}
          >
            Lưu phân quyền
          </Button>
        </div>
        <div>
          <input
            type="checkbox"
            checked={
              roles.filter((role) => role?.isChecked !== true).length < 1
            }
            name="allSelect"
            value="allSelect"
            onChange={handleChange}
          />
          <span className="text-red-900 font-bold ml-1">Tất cả</span>
        </div>
        <div className="flex flex-col flex-wrap">
          {roles &&
            roles.map((role, index) => (
              <div key={role.name} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={role?.isChecked || false}
                  name={role.name}
                  onChange={handleChange}
                />
                <span className="text-black">{role.monthi}</span>
              </div>
            ))}
        </div>
      </Paper>
    </div>
  );
}
