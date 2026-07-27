import { Button, LinearProgress, Paper, Skeleton, TextField } from '@mui/material'
import React, {useState} from 'react'
import FormAddRoleUser from './components/FormAddRoleUser'
import userApi from './../../api/userApi';
import { useSnackbar } from 'notistack';
import TableUser from './components/TableUser';
import PaginationComponent from '../../components/PaginationComponent';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import querystring from "query-string";
import { useEffect } from 'react';
import DialogDelete from '../../components/DialogDelete';
import { useDispatch, useSelector } from 'react-redux';
import { changeRole } from '../../auth/authSlice';
import jwt_decode from "jwt-decode"


export default function QuanlyTaikhoan() {
  const [tentaikhoan, setTentaikhoan] = useState('');
  const [matkhau, setMatkhau] = useState('');
  const [thutu, setThutu] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 1,
  });

  const [userTemp, setUserTemp] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();


  // state open dialog delete user
  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null,
  });

   // state open dialog edit user
  const [openDialogEditUser, setOpenDialogEditUser] = useState({
    status: false,
    user: null,
  });

  const dispatch = useDispatch()
  const roles = useSelector((state) =>(state.authReducer.roles_x01));

  const queryParams = useMemo(() => {
    const params = querystring.parse(location.search);
    return {
      ...params,
      page: Number(params.page) || 1,
    };
  }, [location.search]);

  const {enqueueSnackbar} = useSnackbar();

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };

  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete({
      status: true,
      id_Delete: id,
    });
  };

  // func thay đổi số trang
  const handleChangePage = (value) => {
    setPagination({
      ...pagination,
      page: value,
    });

    const newFilters = {
      ...queryParams,
      page: value,
    };

    setSearchParams(newFilters);
  };
 
  //func add user
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      let res = await userApi.addUser({tentaikhoan, matkhau, thutu});
      setIsSubmitting(false)
      enqueueSnackbar('Thêm mới tài khoản thành công!',{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        },
         variant: 'success' 
      });
      setTentaikhoan('');
      setMatkhau('');
      setThutu(1);
      setUserList(res.data.users);
      setPagination({
        page:1, 
        total: res.data.total
      });
    } catch (error) {

      if(error.message === "Token không hợp lệ vui lòng đăng nhập hoặc đã hết hạn. Vui lòng đăng nhập lại"){
        navigate('/login');
        enqueueSnackbar(error.message, {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
      };

      enqueueSnackbar(error.response.data.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
    }
  };

  const handleSubmitEditUser = async (values) => {
    let page = pagination.page;
    const obj= {...values, page}
    try {
      
      let res = await userApi.editUser(obj);
      // const accessToken = localStorage.getItem('accessToken_thitracnghiem');
      // const decodedToken = jwt_decode(accessToken);
      // // console.log(obj.id_edit)
      // // console.log(decodedToken.userId)
      // // console.log(obj.id_edit === decodedToken.userId)
      // if(obj.id_edit === decodedToken.userId){
      //   // console.log(values)
      //   dispatch(changeRole(values.roles))
      // }

      setUserList(res.data.users);
      setUserTemp(null)
      enqueueSnackbar(res.data.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });

    } catch (error) {
      if(error.message === "Token không hợp lệ vui lòng đăng nhập hoặc đã hết hạn. Vui lòng đăng nhập lại"){
        navigate('/login');
        enqueueSnackbar(error.message, {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
      };
console.log(error)
      enqueueSnackbar(error.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      let res = await userApi.deleteUser(openDialogDelete.id_Delete);
      setUserList(res.data.users);
      setPagination({
        ...pagination,
        page: 1,
        total: res.data.total,
      });

      const newFilters = {
        ...queryParams,
        page: 1,
      };

      setSearchParams(newFilters);

      setOpenDialogDelete({
        ...openDialogDelete,
        status: false,
      });

      enqueueSnackbar(res.data.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });
    } catch (error) {
      if(error.message === "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"){
        navigate('/login');
        enqueueSnackbar(error.message, {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
      };
      enqueueSnackbar(error.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
    }
  };

  const handleCancelDelete = () => {
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };

  // useEffect get user list
useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userApi.getUsers(queryParams.page);
        setUserList(res.data.users);
        setPagination({
          page: Number(res.data.page),
          total: res.data.total,
        });
        setLoading(false);
      
      } catch (error) {
        if(error.message === "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"){
          enqueueSnackbar(error.message,{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            },
             variant: 'error' 
          });
          navigate('/login');
        }else{
          enqueueSnackbar(error.message,{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            },
             variant: 'error' 
          });
          navigate('/login');
        }
      }
    };

    fetchUsers();
  }, [queryParams]);

  const handleSettingRoleUser = (user) => {
    setUserTemp(user)
  };

  return (
    <div className='flex flex-col mx-2 space-x-1 lg:flex-row'>
      <div className='lg:basis-2/3 bg-white px-4'>
        <h1 className='text-gray-900 text-center mt-2 pt-4 font-bold sm:text-[14px] md:text-[16px]'>Quản lý tài khoản người dùng</h1>
        {isSubmitting && <LinearProgress />}

        {roles && roles.includes("thêm tài khoản") &&(
          <form className='flex flex-col items-center space-x-0 justify-start mt-8 flex-wrap md:flex-row md:space-x-4' >
            <div className='my-2 w-full md:w-[auto]'>
            <TextField name="tentaikhoan" fullWidth={true} label="Tên tài khoản" value={tentaikhoan} onChange={(e) => setTentaikhoan(e.target.value)} size="small"/>
            </div>
            <div className='my-2 w-full md:w-[auto]'>
            <TextField name="matkhau" fullWidth={true} label="Mật khẩu" value={matkhau} onChange={(e) => setMatkhau(e.target.value)} size="small"/>
            </div>
            <div className='my-2 w-full md:w-[auto]'>
            <TextField name="thutu" fullWidth={true} label="Thứ tự" value={thutu} onChange={(e) => setThutu(e.target.value)} type="number"  size="small"/>
            </div>
            <div className='my-2 w-full md:w-[auto] text-center'>
            <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>Thêm mới</Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className='mt-2'>
            <Skeleton variant="rectangular" width="100%" height="450px" />
          </div>
      ) : (
        <>
        <TableUser
          userList={userList}
          page={pagination.page}
          onClickOpenDialogDelete={handleOpenDialogDelete}
          onClickSettingRoleUser={handleSettingRoleUser}
          userTemp={userTemp}
        />
        <PaginationComponent
        page={pagination.page}
        totalPage={pagination.total}
        onChangePage={handleChangePage}
      />
        </>
      )}

      </div>

      <div className="lg:basis-1/3 bg-white">
          <FormAddRoleUser 
            userTemp={userTemp}
            onHandleEditUser={handleSubmitEditUser}
          />
      </div>

      <DialogDelete
        open={openDialogDelete.status}
        onCloseDialogDelete={handleCloseDialogDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </div>
  )
}
