import { TextField, Paper, Button, LinearProgress } from "@mui/material";
import React, {useState, useEffect} from "react";
import RoleList from "./RoleList";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function FormAddRoleUser({ userTemp, onHandleEditUser }) {
  let roleListTemp= [];

  const [roleList, setRoleList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setRoleList(userTemp !== null ? userTemp.roles : [])
  },[userTemp])

  const handleSubmitSettingRoles = async () => {
    let data = {
      id_edit: userTemp._id,
      roles: roleList
    }
    setLoading(true)
    await onHandleEditUser(data)
    setLoading(false)
    setRoleList([])
  };

  const handleChangeRoleList = (checkedFilter, unCheckedFilter) => {
    roleListTemp = roleList;
    
    if(unCheckedFilter.length > 0){
      unCheckedFilter.forEach(e => {
        let index = roleListTemp.findIndex((el)=> el === e);
        if(index !== -1){
          roleListTemp.splice(index,1)
        };
      });
    };
    roleListTemp = roleListTemp.concat(checkedFilter)
    roleListTemp = Array.from(new Set(roleListTemp)) //loại bỏ các phần tử giống nhau trong array
    setRoleList(roleListTemp)
  };

  return (
    <div className="px-2 py-4">
      {loading && <LinearProgress />}
      <h3 className="text-center text-black font-bold sm:text-[14px] md:text-[16px]">
        Phân quyền cho tài khoản
        <span className="ml-1">{userTemp && userTemp.tentaikhoan}</span>
      </h3>

      <div className="text-right mb-2">
        <Button variant="contained" onClick={handleSubmitSettingRoles} disabled={userTemp === null || loading}>
          Cập nhật
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">Xem</TableCell>
              <TableCell align="right">Thêm</TableCell>
              <TableCell align="right">Sửa</TableCell>
              <TableCell align="right">Xóa</TableCell>
              <TableCell align="right">Full</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* danh sách phân quyền  */}
            <RoleList
              label="QL tài khoản"
              values={[
                { name: "xem tài khoản" },
                { name: "thêm tài khoản" },
                { name: "sửa tài khoản" },
                { name: "xóa tài khoản" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            <RoleList
              label="Phân quyền QL kiến thức đánh giá"
              values={[
                { name: "xem phân quyền quản lý môn thi" },
                { name: "thêm phân quyền quản lý môn thi" },
                { name: "sửa phân quyền quản lý môn thi" },
                { name: "xóa phân quyền quản lý môn thi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            
            {/* <RoleList
              label="QL đơn vị"
              values={[
                { name: "xem đơn vị" },
                { name: "thêm đơn vị" },
                { name: "sửa đơn vị" },
                { name: "xóa đơn vị" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            /> */}

            <RoleList
              label="QL kiến thức đánh giá"
              values={[
                { name: "xem môn thi" },
                { name: "thêm môn thi" },
                { name: "sửa môn thi" },
                { name: "xóa môn thi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />

            <RoleList
              label="QL cuộc đánh giá"
              values={[
                { name: "xem cuộc thi" },
                { name: "thêm cuộc thi" },
                { name: "sửa cuộc thi" },
                { name: "xóa cuộc thi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />

            {/* <RoleList
              label="QL thí sinh"
              values={[
                { name: "xem thí sinh" },
                { name: "thêm thí sinh" },
                { name: "sửa thí sinh" },
                { name: "xóa thí sinh" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            /> */}

            <RoleList
              label="QL câu hỏi"
              values={[
                { name: "xem câu hỏi" },
                { name: "thêm câu hỏi" },
                { name: "sửa câu hỏi" },
                { name: "xóa câu hỏi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />

            <RoleList
              label="Thay đổi trạng thái cuộc đánh giá"
              values={[
                { name: "xem trạng thái cuộc thi" },
                { name: "thêm trạng thái cuộc thi" },
                { name: "sửa trạng thái cuộc thi" },
                { name: "xóa trạng thái cuộc thi" },
              ]}
              onChangeRoleList={handleChangeRoleList}
              userTemp={userTemp}
            />
            
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
