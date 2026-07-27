import React, { useEffect, useState } from "react";
import {TableRow, TableCell} from '@mui/material';

export default function RoleList({label, values, onChangeRoleList,  userTemp}) {
  const [roles, setRoles] = useState([]);

  useEffect(()=>{
    setRoles(values)
  }, [])

  useEffect(()=>{
    if(userTemp){
      let newState = []
      values.forEach(i=>{
        if(userTemp.roles.includes(i.name)){
          newState.push({
            name: i.name,
            isChecked: true
          })
        }else{
          newState.push({
            name: i.name,
            isChecked: false
          })
        }
    })
      setRoles(newState)
    }else{
      setRoles(values)
    }
  },[userTemp])
  //function change checkbox
  const handleChange = (e) => {
    const { name, checked } = e.target;
 
    if (name === "allSelect") {
      let tempRole = roles.map(role => {
       return { ...role, isChecked: checked}}
       );
      setRoles(tempRole)
      let checkedFilter=[];
      let unCheckedFilter=[];
      
      tempRole.forEach(i => {
        if(i.isChecked === true){
          checkedFilter.push(i.name)
        }else{
          unCheckedFilter.push(i.name)
        }
      });

      onChangeRoleList(checkedFilter, unCheckedFilter)  
    } else {
      let tempRole = roles.map(role =>
        role.name === name ? {...role, isChecked: checked} : role
      );
      setRoles(tempRole);
      let checkedFilter=[];
      let unCheckedFilter=[];

      tempRole.forEach(i => {
        if(i.isChecked === true){
          checkedFilter.push(i.name)
        }else{
          unCheckedFilter.push(i.name)
        }
      })
      onChangeRoleList(checkedFilter, unCheckedFilter)   
    } 
  };

  
  return (
        <TableRow
          // key={}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row"><span className="font-bold">{label}</span></TableCell>
          {roles && roles.map((role, index)=>(
               <TableCell align="right" key={role.name}>
                <input
                  type="checkbox"
                  checked={role?.isChecked || false}
                  name={role.name}
                  onChange={handleChange}
                />
              </TableCell>
          ))}

            <TableCell align="right">
                <input
                  type="checkbox"
                  checked={roles.filter(role=> role?.isChecked !== true).length < 1}
                  name="allSelect"
                  value="allSelect"
                  onChange={handleChange}
                />
            </TableCell>
        </TableRow>
  );
}
