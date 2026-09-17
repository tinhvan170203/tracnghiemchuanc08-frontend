import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { InputField } from "../../components/form-control/InputField";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import ModalLoading from "../../components/ModalLoading";
import AddIcon from "@mui/icons-material/Add";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import DialogAddCauhoi from "./components/DialogAddCauhoi";
import CustomPaginationActionsTable from "./components/CustomPaginationActionsTable";
import DialogEditCauhoi from "./components/DialogEditCauhoi";
import DialogDelete from "../../components/DialogDelete";
import videoApi from "../../api/videoApi";
import VideoViewer from "../../components/VideoViewer";

const schema = yup.object({}).required();

const Videos = () => {
  const form = useForm({
    defaultValues: {
      search: "",
      active: "",
    },
    resolver: yupResolver(schema),
  });

  const roles = useSelector((state) => state.authReducer.roles_x01);
  const canAdd = roles && roles.includes("thêm video tuyên truyền");

  const [display, setDisplay] = useState({
    status: false,
    video: null,
  });
  const [cauhoiList, setCauhoiList] = useState([]);
  const [listQueryParams, setListQueryParams] = useState({
    search: "",
    active: "",
    scope: "admin",
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openModalLoading, setOpenModalLoading] = useState(false);

  const [openDialogEdit, setOpenDialogEdit] = useState({
    status: false,
    item: null,
  });

  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null,
  });

  const [openDialogAddCauhoi, setOpenDialogAddCauhoi] = useState(false);

  const fetchVideos = async (params = listQueryParams) => {
    try {
      setOpenModalLoading(true);
      const res = await videoApi.getVideos(params);
      setCauhoiList(res.data);
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
      }
      enqueueSnackbar(error.message || "Không tải được danh sách video", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    } finally {
      setOpenModalLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenDialogEdit = (item) => {
    setOpenDialogEdit({ item, status: true });
  };

  const handleCloseDialogEdit = () => {
    setOpenDialogEdit((prev) => ({ ...prev, status: false }));
  };

  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete({ status: true, id_Delete: id });
  };

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete((prev) => ({ ...prev, status: false }));
  };

  const handleCancelDelete = () => {
    setOpenDialogDelete((prev) => ({ ...prev, status: false }));
  };

  const handleCloseDialogAddCauhoi = () => {
    setOpenDialogAddCauhoi(false);
  };

  const handleOpenDialogAddCauhoi = () => {
    setOpenDialogAddCauhoi(true);
  };

  const handleFormSearchSubmit = async (values) => {
      const params = {
        search: values.search?.trim() || "",
        active: values.active || "",
        scope: "admin",
      };
    setListQueryParams(params);
    await fetchVideos(params);
  };

  const handleDeleteField = () => {
    form.reset({ search: "", active: "" });
    const params = { search: "", active: "", scope: "admin" };
    setListQueryParams(params);
    fetchVideos(params);
  };

  const handleSubmitAddCauhoi = async (values, onProgress) => {
    try {
      const res = await videoApi.addVideo(values, onProgress, listQueryParams);
      setCauhoiList(res.data.items);
      enqueueSnackbar("Thêm mới thành công!", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
      }
      enqueueSnackbar(error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    }
  };

  const handleSubmitEdit = async (values) => {
    try {
      const res = await videoApi.editVideo(
        { ...values, id_edit: openDialogEdit.item._id },
        listQueryParams
      );
      setCauhoiList(res.data.items);
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
      }
      enqueueSnackbar(error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await videoApi.deleteVideo(
        openDialogDelete.id_Delete,
        listQueryParams
      );
      setCauhoiList(res.data.items);
      setOpenDialogDelete((prev) => ({ ...prev, status: false }));
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
      }
      enqueueSnackbar(error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    }
  };

  const handleToggleActive = async (row, active) => {
    try {
      const res = await videoApi.setActive(row._id, {
        active,
        search: listQueryParams.search,
        activeFilter: listQueryParams.active,
      });
      setCauhoiList(res.data.items);
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
      }
      enqueueSnackbar(error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    }
  };

  const handlePlayVideo = (video) => {
    setDisplay({ status: true, video });
  };

  return (
    <Box
      sx={{
        mx: { xs: 1, sm: 2 },
        mb: 2,
        bgcolor: "#fff",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.75, sm: 2 },
          // background:
          //   "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #2563eb 100%)",
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
            <OndemandVideoIcon />
          </Box>
          <Box>
            <Typography fontWeight={700} fontSize={{ xs: "1rem", sm: "1.15rem" }}>
              Quản lý video tuyên truyền
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Tra cứu, thêm mới và chỉnh trạng thái hiển thị video
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
        <Box
          component="form"
          onSubmit={form.handleSubmit(handleFormSearchSubmit)}
          sx={{
            mb: 2.5,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#fafafa",
          }}
        >
          <Typography
            fontWeight={700}
            fontSize="0.9rem"
            color="text.secondary"
            sx={{ mb: 1.5 }}
          >
            Tra cứu video
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <InputField
                name="search"
                form={form}
                label="Tiêu đề / mô tả"
                type="text"
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="video-active-filter">Trạng thái hiển thị</InputLabel>
                <Select
                  labelId="video-active-filter"
                  label="Trạng thái hiển thị"
                  value={form.watch("active")}
                  onChange={(e) => form.setValue("active", e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="true">Đang hiển thị</MenuItem>
                  <MenuItem value="false">Đã ẩn</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                justifyContent={{ md: "flex-end" }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  fullWidth
                  startIcon={<SearchIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    minHeight: 40,
                    width: { sm: "auto" },
                  }}
                >
                  Tìm kiếm
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleDeleteField}
                  color="warning"
                  fullWidth
                  startIcon={<BackspaceIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    minHeight: 40,
                    width: { sm: "auto" },
                  }}
                >
                  Xóa trắng
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {display.status && (
          <Box
            sx={{
              mb: 2.5,
              p: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              maxWidth: { xs: "100%", md: 560 },
              mx: "auto",
            }}
          >
            <VideoViewer video={display.video} />
          </Box>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {cauhoiList.length} video
          </Typography>
          {canAdd && (
            <Button
              variant="contained"
              onClick={handleOpenDialogAddCauhoi}
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                minHeight: 40,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Thêm mới video tuyên truyền
            </Button>
          )}
        </Stack>

        {openModalLoading && <ModalLoading open={openModalLoading} />}

        <Box
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <CustomPaginationActionsTable
            list={cauhoiList}
            onClickOpenDialogDelete={handleOpenDialogDelete}
            onClickOpenDialogEdit={handleOpenDialogEdit}
            onViewPlayer={handlePlayVideo}
            onToggleActive={handleToggleActive}
          />
        </Box>
      </Box>

      <DialogAddCauhoi
        open={openDialogAddCauhoi}
        onCloseDialogAddCauhoi={handleCloseDialogAddCauhoi}
        onSubmit={handleSubmitAddCauhoi}
      />

      <DialogEditCauhoi
        open={openDialogEdit.status}
        item={openDialogEdit.item}
        onCloseDialogEdit={handleCloseDialogEdit}
        onSubmit={handleSubmitEdit}
      />

      <DialogDelete
        open={openDialogDelete.status}
        onCloseDialogDelete={handleCloseDialogDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </Box>
  );
};

export default Videos;
