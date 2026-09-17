import React, { useState, useEffect, useMemo } from "react";
import AddDonviManage from "./components/AddDonviManage";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import querystring from "query-string";
import userApi from "./../../api/userApi";
import TableUserManage from "./components/TableUerManage";
import PaginationComponent from "../../components/PaginationComponent";
import { Box, Grid, Paper, Skeleton, Stack, Typography } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import commonApi from "./../../api/commonApi";
import { useSnackbar } from "notistack";

const PhanquyenQuanlyDonvi = () => {
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
  const { enqueueSnackbar } = useSnackbar();

  const queryParams = useMemo(() => {
    const params = querystring.parse(location.search);
    return {
      ...params,
      page: Number(params.page) || 1,
    };
  }, [location.search]);

  const handleChangePage = (value) => {
    setPagination({
      ...pagination,
      page: value,
    });

    setSearchParams({
      ...queryParams,
      page: value,
    });
  };

  const [donvis, setDonvis] = useState([]);

  useEffect(() => {
    const fetchedMonthi = async () => {
      let res = await commonApi.getAllMonthi();

      if (res && res.data.length > 0) {
        let newState = res.data.map((i) => ({
          name: i._id,
          monthi: i.tenmonthi,
        }));
        setDonvis(newState);
      }
    };

    fetchedMonthi();
  }, []);

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
        enqueueSnackbar(error.message, {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
        navigate("/login");
      }
    };

    fetchUsers();
  }, [queryParams]);

  const handleSettingRoleUser = (user) => {
    setUserTemp(user);
  };

  const handleSubmitEdit = async (values) => {
    let page = pagination.page;
    const obj = { ...values, page };
    try {
      let res = await userApi.editQuanlydonvi(obj);
      setUserList(res.data.users);
      setUserTemp(null);
      enqueueSnackbar(res.data.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
        enqueueSnackbar(error.message, {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
      }

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
    <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 3, pt: 1 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          // background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #2563eb 100%)",
          // color: "white",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              p: 1.25,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.15)",
              display: "flex",
            }}
          >
            <MenuBookOutlinedIcon />
          </Box>
          <Box>
            <Typography fontWeight={700} fontSize={{ xs: "1rem", sm: "1.15rem" }}>
              Phân quyền QL kiến thức đánh giá
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Gán quyền quản lý môn thi / kiến thức đánh giá cho từng tài khoản
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 4px 24px rgba(15, 23, 42, 0.05)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography fontWeight={700} fontSize="0.95rem" color="text.secondary">
                Danh sách tài khoản
              </Typography>
              {!loading && (
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {userList.length} tài khoản trên trang
                </Typography>
              )}
            </Stack>

            {loading ? (
              <Skeleton variant="rounded" width="100%" height={360} sx={{ borderRadius: 2 }} />
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
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AddDonviManage
            userTemp={userTemp}
            onHandleEdit={handleSubmitEdit}
            values={donvis}
            onClearUser={() => setUserTemp(null)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PhanquyenQuanlyDonvi;
