import React, {useState, useEffect} from 'react'
import  AddDonviManage  from './components/AddDonviManage'
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import querystring from "query-string";
import userApi from './../../api/userApi';
import TableUserManage from './components/TableUerManage';
import PaginationComponent from '../../components/PaginationComponent';
import { LinearProgress, Skeleton } from '@mui/material';
import commonApi from './../../api/commonApi';
import { useSnackbar } from "notistack";

const PhanquyenQuanlyDonvi = () => {
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [pagination, setPagination] = useState({
      page: 1,
      total: 1,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userTemp, setUserTemp] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();

    const queryParams = useMemo(() => {
        const params = querystring.parse(location.search);
        return {
          ...params,
          page: Number(params.page) || 1,
        };
      }, [location.search]);

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

  const [donvis, setDonvis] = useState([]);

  //lấy ra danh sách các đơn vị
  useEffect(()=>{
    const fetchedMonthi =  async () => {
      let res = await commonApi.getAllMonthi();

      if(res && res.data.length > 0){
        let newState = res.data.map(i=>{
          return {
            name: i._id,
            monthi: i.tenmonthi
          }
        })
        setDonvis(newState)
      }
    };

    fetchedMonthi()
  },[]);
    // useEffect get user list
useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userApi.getUsers(queryParams.page);
        console.log(res)
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


    const handleSubmitEdit = async (values) => {
        let page = pagination.page;
        const obj= {...values, page}
        try {
          let res = await userApi.editQuanlydonvi(obj);
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

  return (
    <div className='flex flex-col mx-2 lg:space-x-1 lg:flex-row'>
    <div className='lg:basis-2/3 bg-white px-4'>
      <h1 className='text-gray-900 text-center mt-2 pt-4 font-bold sm:text-[14px] md:text-[18px]'>
        Phân quyền quản lý kiến thức đánh giá
      </h1>
      {isSubmitting && <LinearProgress />}

      {loading ? (
        <div className='mt-2'>
          <Skeleton variant="rectangular" width="100%" height="450px" />
        </div>
    ) : (
      <>
      <TableUserManage
        userList={userList}
        page={pagination.page}
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
        <AddDonviManage 
            userTemp={userTemp}
            onHandleEdit={handleSubmitEdit}
            values={donvis}
        />
    </div>
  </div>
  )
};

export default PhanquyenQuanlyDonvi
