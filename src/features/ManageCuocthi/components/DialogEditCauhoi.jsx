import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import {
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { InputField } from "../../../components/form-control/InputField";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DateTimeField } from "../../../components/form-control/DateTimeField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = yup
  .object({
    tencuocthi: yup.string().required("Vui lòng nhập tên cuộc đánh giá"),
    soluongcauhoi: yup.number().required("Vui lòng nhập số câu hỏi"),
    thoigianthi: yup.number().required("Vui lòng nhập thời gian thi"),
    ngaytochucthi: yup.string().required("Vui lòng chọn ngày tổ chức"),
  })
  .required();

export default function DialogEditCauhoi({
  open,
  onCloseDialogEdit,
  item,
  onSubmit,
  chuyendeList,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const form = useForm({
    defaultValues: {
      tencuocthi: "",
      password: "",
      thoigianthi: 90,
      soluongcauhoi: 50,
      ngaytochucthi: dayjs(Date.now()),
      tongsonguoithamgia: 0,
      canbothamgiatuyentruyen: "",
    },
    resolver: yupResolver(schema),
  });

  const setValue = form.setValue;
  const [config, setConfig] = useState([]);

  useEffect(() => {
    if (item) {
      setValue("tencuocthi", item.tencuocthi, { shouldValidate: true });
      setValue("thoigianthi", item.thoigianthi);
      setValue("ngaytochucthi", dayjs(item.ngaytochucthi));
      setValue("soluongcauhoi", item.soluongcauhoi);
      setValue("tongsonguoithamgia", item.tongsonguoithamgia ?? 0);
      setValue("canbothamgiatuyentruyen", item.canbothamgiatuyentruyen ?? "");
    }
  }, [item, setValue]);

  useEffect(() => {
    if (item) {
      setConfig(
        (chuyendeList || []).map((i) => {
          const check = (item.config || []).find(
            (e) => e.chuyende?.toString() == i.value
          );
          return {
            chuyende: i.value,
            title: i.label,
            soluongcauhoi: check ? check.soluongcauhoi : 0,
          };
        })
      );
    }
  }, [chuyendeList, item]);

  const handleFormSubmit = async (values) => {
    const arr = config.map((i) => ({
      ...i,
      soluongcauhoi: i.soluongcauhoi === "" ? 0 : Number(i.soluongcauhoi),
    }));

    const total = arr.reduce((s, i) => s + Number(i.soluongcauhoi), 0);
    if (total === 0) {
      alert("Vui lòng nhập cấu hình số lượng câu hỏi cho mỗi chuyên đề");
      return;
    }

    if (onSubmit) {
      await onSubmit({ ...values, id_edit: item._id, config: arr });
      onCloseDialogEdit();
    }
  };

  const handleChangeNumber = (id, event) => {
    setConfig((prev) =>
      prev.map((row) =>
        row.chuyende === id
          ? { ...row, soluongcauhoi: event.target.value }
          : row
      )
    );
  };

  const { isSubmitting } = form.formState;
  const configTotal = config.reduce(
    (s, i) => s + (Number(i.soluongcauhoi) || 0),
    0
  );

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== "backdropClick") onCloseDialogEdit(event, reason);
      }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: { borderRadius: fullScreen ? 0 : 3 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pr: 6,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "#f8fafc",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b45309",
            flexShrink: 0,
          }}
        >
          <EditNoteOutlinedIcon />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={700} fontSize={{ xs: "1rem", sm: "1.1rem" }}>
            Chỉnh sửa cuộc đánh giá
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {item?.tencuocthi || "Cập nhật thông tin và cấu hình chuyên đề"}
          </Typography>
        </Box>
        <IconButton
          onClick={() => onCloseDialogEdit()}
          sx={{ position: "absolute", right: 12, top: 12 }}
          size="small"
        >
          <CancelIcon sx={{ color: "#d32b2b" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
        {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color="text.secondary"
            sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 0.4 }}
          >
            Thông tin chung
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputField
                name="tencuocthi"
                form={form}
                label="Tên cuộc đánh giá *"
                type="text"
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputField
                name="soluongcauhoi"
                form={form}
                label="Số câu hỏi *"
                type="number"
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputField
                name="thoigianthi"
                form={form}
                label="Thời gian (phút) *"
                type="number"
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DateTimeField
                name="ngaytochucthi"
                form={form}
                label="Ngày tổ chức *"
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputField
                name="tongsonguoithamgia"
                form={form}
                label="Tổng số người tham gia"
                type="number"
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputField
                name="canbothamgiatuyentruyen"
                form={form}
                label="Cán bộ tuyên truyền"
                type="text"
                disabled={false}
              />
            </Grid>
          </Grid>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 3, mb: 1.5 }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="text.secondary"
              sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}
            >
              Cấu hình chuyên đề
            </Typography>
            <Typography variant="caption" fontWeight={600} color="primary.main">
              Tổng: {configTotal} câu
            </Typography>
          </Stack>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              borderColor: "#e2e8f0",
            }}
          >
            {config.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có chuyên đề. Vui lòng tạo chuyên đề trước.
                </Typography>
              </Box>
            ) : (
              config.map((i, idx) => (
                <Box
                  key={i.chuyende || idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 2,
                    py: 1.25,
                    borderBottom:
                      idx < config.length - 1 ? "1px solid #f1f5f9" : "none",
                    bgcolor: idx % 2 === 0 ? "#fff" : "#f8fafc",
                  }}
                >
                  <Typography
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 14,
                      color: "#334155",
                      fontWeight: 500,
                    }}
                  >
                    {i.title}
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={i.soluongcauhoi}
                    onChange={(e) => handleChangeNumber(i.chuyende, e)}
                    inputProps={{ min: 0 }}
                    sx={{
                      width: 88,
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              ))
            )}
          </Paper>

          <DialogActions sx={{ px: 0, pt: 3, pb: 0, gap: 1 }}>
            <Button
              onClick={() => onCloseDialogEdit()}
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={isSubmitting}
              type="submit"
              startIcon={<SaveOutlinedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 2.5,
                minHeight: 42,
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
