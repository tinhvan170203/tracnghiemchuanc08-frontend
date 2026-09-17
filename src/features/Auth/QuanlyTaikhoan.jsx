import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import FormAddRoleUser from "./components/FormAddRoleUser";
import userApi from "./../../api/userApi";
import { useSnackbar } from "notistack";
import TableUser from "./components/TableUser";
import PaginationComponent from "../../components/PaginationComponent";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import querystring from "query-string";
import DialogDelete from "../../components/DialogDelete";
import DialogResetPassword from "./components/DialogResetPassword";
import { useDispatch, useSelector } from "react-redux";

export default function QuanlyTaikhoan() {
  const [tentaikhoan, setTentaikhoan] = useState("");
  const [matkhau, setMatkhau] = useState("");
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

  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null,
  });

  const [openDialogReset, setOpenDialogReset] = useState({
    status: false,
    user: null,
  });
  const [resetting, setResetting] = useState(false);

  const roles = useSelector((state) => state.authReducer.roles_x01);

  const queryParams = useMemo(() => {
    const params = querystring.parse(location.search);
    return {
      ...params,
      page: Number(params.page) || 1,
    };
  }, [location.search]);

  const { enqueueSnackbar } = useSnackbar();

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      let res = await userApi.addUser({ tentaikhoan, matkhau, thutu });
      setIsSubmitting(false);
      enqueueSnackbar("Thêm mới tài khoản thành công!", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
      setTentaikhoan("");
      setMatkhau("");
      setThutu(1);
      setUserList(res.data.users);
      setPagination({
        page: 1,
        total: res.data.total,
      });
    } catch (error) {
      setIsSubmitting(false);
      if (
        error.message ===
        "Token không hợp lệ vui lòng đăng nhập hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
        enqueueSnackbar(error.message, {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
        });
      }

      enqueueSnackbar(error.response?.data?.message || error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    }
  };

  const handleSubmitEditUser = async (values) => {
    let page = pagination.page;
    const obj = { ...values, page };
    try {
      let res = await userApi.editUser(obj);
      setUserList(res.data.users);
      setUserTemp(null);
      enqueueSnackbar(res.data.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ vui lòng đăng nhập hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
        enqueueSnackbar(error.message, {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
        });
      }
      enqueueSnackbar(error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
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

      setSearchParams({
        ...queryParams,
        page: 1,
      });

      setOpenDialogDelete({
        ...openDialogDelete,
        status: false,
      });

      enqueueSnackbar(res.data.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
        enqueueSnackbar(error.message, {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
        });
      }
      enqueueSnackbar(error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
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
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
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

  const handleOpenResetPassword = (user) => {
    setOpenDialogReset({ status: true, user });
  };

  const handleCloseResetPassword = () => {
    if (resetting) return;
    setOpenDialogReset({ status: false, user: null });
  };

  const handleSubmitResetPassword = async (matkhau_moi) => {
    if (!openDialogReset.user?._id) return;
    setResetting(true);
    try {
      const res = await userApi.resetPassword(openDialogReset.user._id, {
        matkhau_moi,
      });
      enqueueSnackbar(res.data.message || "Reset mật khẩu thành công", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
      setOpenDialogReset({ status: false, user: null });
    } catch (error) {
      enqueueSnackbar(error?.message || "Reset mật khẩu thất bại", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 3, pt: 1 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          // background: "linear-gradient(135deg, #2263eb 0%, #1e3a5f 55%, #2563eb 100%)",
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
            <ManageAccountsIcon />
          </Box>
          <Box>
            <Typography fontWeight={700} fontSize={{ xs: "1rem", sm: "1.15rem" }}>
              Quản lý tài khoản
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Thêm tài khoản, phân quyền và quản lý người dùng hệ thống
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {/* Left: list + add form */}
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
            {roles && roles.includes("thêm tài khoản") && (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <PersonAddAltIcon color="primary" fontSize="small" />
                  <Typography fontWeight={700} fontSize="0.95rem">
                    Thêm tài khoản mới
                  </Typography>
                </Stack>
                {isSubmitting && <LinearProgress sx={{ mb: 1.5, borderRadius: 1 }} />}
                <Grid container spacing={1.5} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="tentaikhoan"
                      fullWidth
                      label="Tên tài khoản"
                      value={tentaikhoan}
                      onChange={(e) => setTentaikhoan(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="matkhau"
                      fullWidth
                      label="Mật khẩu"
                      type="password"
                      value={matkhau}
                      onChange={(e) => setMatkhau(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      name="thutu"
                      fullWidth
                      label="Thứ tự"
                      value={thutu}
                      onChange={(e) => setThutu(e.target.value)}
                      type="number"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      disabled={isSubmitting}
                      fullWidth
                      startIcon={<PersonAddAltIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        minHeight: 40,
                      }}
                    >
                      Thêm mới
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

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
                <TableUser
                  userList={userList}
                  page={pagination.page}
                  onClickOpenDialogDelete={handleOpenDialogDelete}
                  onClickSettingRoleUser={handleSettingRoleUser}
                  onClickResetPassword={handleOpenResetPassword}
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

        {/* Right: roles */}
        <Grid item xs={12} lg={4}>
          <FormAddRoleUser
            userTemp={userTemp}
            onHandleEditUser={handleSubmitEditUser}
            onClearUser={() => setUserTemp(null)}
          />
        </Grid>
      </Grid>

      <DialogDelete
        open={openDialogDelete.status}
        onCloseDialogDelete={handleCloseDialogDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />

      <DialogResetPassword
        open={openDialogReset.status}
        user={openDialogReset.user}
        loading={resetting}
        onClose={handleCloseResetPassword}
        onSubmit={handleSubmitResetPassword}
      />
    </Box>
  );
}
